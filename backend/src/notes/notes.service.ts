import { HttpStatus, Injectable } from '@nestjs/common';
import { createResponse } from '../common/responses/createResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../admin/entities';
import { In, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { TNote } from '../admin/caregiver/types';
import { TArrayResponse, TResponse } from '../common/types';
import { AdminService } from 'src/admin/admin.service';
import { ConfigService } from '@nestjs/config';
import { MinioClientService } from 'src/minio/minio.service';
import { AddNoteDto } from '../admin/caregiver/dto';
import { NoteCategory } from './entities/noteCategory.entity';
import { FileArray, TDownloadNoteAttachment } from './types';
import { GetNotesFilterDto, UpdateNoteDto } from 'src/admin/caregiver/dto';
import { Attachment } from './entities/attachment.entity';
import { v4 as uuidv4 } from 'uuid';
import { FilterService } from 'src/filter/filter.service';
import { createResponseDetails } from 'src/common/responses/createResponseDetails';
import { NotificationSettings } from 'src/notifications/entities';
import { NotificationsService } from '../notifications/notifications.service';
import { ENotificationPriority, ENotificationTitle } from '../notifications/types';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { Logger } from '../logger/logger.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,

    @InjectRepository(NoteCategory)
    private readonly noteCategoryRepository: Repository<NoteCategory>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(NotificationSettings)
    private readonly notificationSettingsRepository: Repository<NotificationSettings>,

    private readonly adminService: AdminService,

    private readonly configService: ConfigService,

    private readonly minioClientService: MinioClientService,

    private readonly filterService: FilterService,

    private readonly notificationService: NotificationsService,

    private readonly loggerService: Logger,
  ) {}

  async getNotes(
    adminId: number,
    seniorId: number,
    filterDto: GetNotesFilterDto,
  ): Promise<TResponse<TArrayResponse<Note>>> {
    const loggedAdmin = await this.adminRepository.findOne({
      where: {
        id: adminId,
        users: {
          id: seniorId,
        },
      },
      relations: ['users'],
    });

    if (!loggedAdmin) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }

    const queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.attachments', 'attachments')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.author', 'author')
      .where('note.user.id = :seniorId', { seniorId })
      .orderBy('note.created_at', 'DESC');

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const notes = await filteredQueryBuilder.getMany();
    const noteIds = notes.map((note) => note.id);

    const filteredNotes = await this.noteRepository.find({
      where: {
        id: In(notes.map((note) => note.id)),
      },
      relations: ['attachments', 'category', 'author'],
    });
    const noteOrderMap = new Map(noteIds.map((id, index) => [id, index]));
    filteredNotes.sort((a, b) => noteOrderMap.get(a.id) - noteOrderMap.get(b.id));

    const response = createResponseDetails<Note>(filteredNotes, filterDto, total);

    return createResponse(HttpStatus.OK, response, 'Notes fetched');
  }

  async deleteNote(userId: number, noteId: number): Promise<TResponse> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId);

    const noteToDelete = await this.noteRepository.findOne({
      where: {
        id: noteId,
        author: { id: loggedInAdmin.id },
      },
      relations: ['attachments', 'category'],
    });

    if (!noteToDelete) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Note not found.');
    }

    const attachmentsToDelete = noteToDelete?.attachments.map(({ name, unique_name }) => ({
      name,
      unique_name,
    }));
    const { bucketNameNotes } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    const buckets = await s3Client.listBuckets();
    const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameNotes);

    if (!bucketExists) {
      return createResponse(HttpStatus.BAD_REQUEST, null, `Bucket ${bucketNameNotes} does not exist.`);
    }

    await this.noteRepository.remove(noteToDelete);

    if (attachmentsToDelete.length) {
      try {
        await s3Client.deleteObjects({
          Bucket: bucketNameNotes,
          Delete: {
            Objects: attachmentsToDelete.map((att) => ({ Key: att.unique_name })),
          },
        });
      } catch (error) {
        this.loggerService.log(error);
        return createResponse(HttpStatus.BAD_REQUEST, null, 'Failed to delete attachments.');
      }
    }

    return createResponse(HttpStatus.OK, null, 'Note deleted.');
  }

  async addNote(adminId: number, seniorId: number, noteDto: AddNoteDto): Promise<TResponse<number>> {
    const loggedAdminWithSenior = await this.adminRepository.findOne({
      where: { id: adminId, users: { id: seniorId } },
      relations: ['users', 'users.admins'],
    });

    if (!loggedAdminWithSenior) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }

    const noteCategory = noteDto.category
      ? await this.noteCategoryRepository.find({
          where: {
            category_name: In(noteDto.category),
          },
        })
      : [];

    const newNote = new Note();
    Object.assign(newNote, {
      ...noteDto,
      author: loggedAdminWithSenior,
      user: loggedAdminWithSenior.users[0],
      category: noteCategory,
    });

    await this.noteRepository.save(newNote);

    const adminsAssignedToUser = loggedAdminWithSenior.users.flatMap((user) =>
      user.admins
        .filter((assignedAdmin) => assignedAdmin.id !== adminId)
        .map((el) => ({
          id: el.id,
          email_address: el.email_address,
        })),
    );

    const priority = newNote.priority ? ENotificationPriority.HIGH : ENotificationPriority.MEDIUM;
    const link = this.configService.get('domain') + `/seniors/senior-profile?id=&${seniorId}&name=Notes`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_NOTE_ADDED,
      priority,
      adminsAssignedToUser,
      loggedAdminWithSenior.users[0].first_name + ' ' + loggedAdminWithSenior.users[0].last_name,
      link,
    );

    return createResponse(HttpStatus.CREATED, newNote.id, 'Note added.');
  }

  async uploadFilesToNote(uploadedFiles: FileArray, noteId: number, adminId: number): Promise<TResponse> {
    const { bucketNameNotes, region } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    const buckets = await s3Client.listBuckets();
    const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameNotes);

    if (!bucketExists) {
      try {
        await s3Client.createBucket({
          Bucket: bucketNameNotes,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      } catch (error) {
        return createResponse(HttpStatus.BAD_REQUEST, null, 'Failed to create bucket.');
      }
    }

    try {
      const note = await this.noteRepository.findOne({
        where: {
          id: noteId,
          author: { id: adminId },
        },
      });
      if (!note) {
        return createResponse(HttpStatus.NOT_FOUND, null, 'Note not found');
      }
      await Promise.all(
        uploadedFiles.files.map(async (file) => {
          const { originalname, buffer } = file;
          const uniqueName = `${uuidv4()}.${originalname.split('.').pop()}`;
          await s3Client.putObject({
            Bucket: bucketNameNotes,
            Key: uniqueName,
            Body: buffer,
            ContentType: 'application/octet-stream',
          });

          const attachments = new Attachment();
          Object.assign(attachments, {
            name: originalname,
            unique_name: uniqueName,
            note,
          });
          await this.attachmentRepository.save(attachments);
        }),
      );
    } catch (error) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Failed to upload image.');
    }

    return createResponse(HttpStatus.OK, null, 'Files uploaded.');
  }

  async updateNote(
    userId: number,
    noteId: number,
    { title, note, priority, category }: UpdateNoteDto,
  ): Promise<TResponse> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId);

    const noteToUpdate = await this.noteRepository.findOne({
      where: {
        id: noteId,
        author: { id: loggedInAdmin.id },
      },
      relations: ['category'],
    });

    if (!noteToUpdate) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Note not found.');
    }

    if (category) {
      const categoriesToUpdate = await this.noteCategoryRepository.find({
        where: { category_name: In(category) },
      });

      const missingCategories = category.filter(
        (cat) => !categoriesToUpdate.some(({ category_name }) => category_name === cat),
      );

      if (missingCategories.length > 0) {
        return createResponse(HttpStatus.BAD_REQUEST, null, `Some categories do not exist: ${missingCategories}.`);
      }

      noteToUpdate.category = categoriesToUpdate;
    }

    noteToUpdate.title = title;
    noteToUpdate.note = note;
    noteToUpdate.priority = priority;

    await this.noteRepository.save(noteToUpdate);

    return createResponse(HttpStatus.OK, null, 'Note updated.');
  }

  async getNoteById(adminId: number, seniorId: number, noteId: number): Promise<TResponse<TNote>> {
    const note = await this.noteRepository.findOne({
      where: {
        id: noteId,
        user: {
          id: seniorId,
          admins: { id: adminId },
        },
      },
      relations: ['attachments', 'category', 'author'],
    });

    if (!note) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Note not found.');
    }
    const editable = note.author.id === adminId;

    return createResponse(HttpStatus.OK, { ...note, editable }, 'Note fetched');
  }

  async getNoteAuthors(adminId: number, seniorId: number): Promise<TResponse<Admin[]>> {
    const notes = await this.noteRepository.find({
      where: {
        user: {
          id: seniorId,
          admins: { id: adminId },
        },
      },
      select: ['author', 'id'],
      relations: ['author'],
    });

    if (!notes.length) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Note authors not found.');
    }

    const authors = notes?.map((note) => note.author);
    const uniqueAuthors: Admin[] = Object.values(
      authors.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, []),
    );

    return createResponse(HttpStatus.OK, uniqueAuthors, 'Note authors fetched');
  }

  async downloadNoteAttachment(caregiverId: number, attachmentId: number): Promise<TResponse<TDownloadNoteAttachment>> {
    const note = await this.noteRepository.findOne({
      where: {
        user: {
          admins: {
            id: caregiverId,
          },
        },
        attachments: {
          id: attachmentId,
        },
      },
      relations: ['attachments'],
    });

    if (!note) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Attachment not found.');
    }

    const { bucketNameNotes } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    const { unique_name, name } = note.attachments[0];
    const extension = name.match(/\.(\w+)$/)?.[1];

    try {
      const params = {
        Bucket: bucketNameNotes,
        Key: unique_name,
      };

      await s3Client.headObject(params);
    } catch (error) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Attachment not found');
    }

    try {
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketNameNotes,
        Key: unique_name,
      });

      const response = await s3Client.send(getObjectCommand);
      const stream = response.Body as Readable;

      if (!stream) {
        throw new Error('No body found in S3 response');
      }

      let buffer: Buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const responsePayload = {
        attachment: buffer,
        name,
        extension,
      };

      return createResponse(HttpStatus.OK, responsePayload, 'Attachment fetched.');
    } catch (error) {
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Failed to fetch the attachment.');
    }
  }
}
