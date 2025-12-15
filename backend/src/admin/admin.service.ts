import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityTarget, Not, QueryRunner, Repository } from 'typeorm';
import { Admin, Institution, Onboarding, Role, Status } from './entities';
import { ESortOrder, TArrayResponse, TResponse } from 'src/common/types';
import { createResponse } from 'src/common/responses/createResponse';
import { ERole, EStatus, ELanguage } from './types';
import { EmailService } from 'src/email/email.service';
import {
  AddSuperInstitutionAdminDto,
  ChangeInstitutionOwnerDto,
  GetSuperInsitutionAdminsFilterDto,
  SetStatusDto,
  UpdateInstitutionNameDto,
  UpdateSuperInstitutionAdminDetailsDto,
} from './dto';
import { FilterService } from 'src/filter/filter.service';
import { createResponseDetails } from 'src/common/responses/createResponseDetails';
import { generateKey, hashString } from 'src/utils';
import { RedisService } from 'src/redis/redis.service';
import { UpdateInstitutionDetailsDto } from '../common/dto';
import { Address } from 'src/common/entities/address.entity';
import { randomBytes } from 'crypto';
import { User } from '../user/entities/user.entity';
import { OnboardingService } from '../common/utils/create-onboarding';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TAdminResponseKey } from '../common/utils/translationKeys';
import { NotificationSettings } from 'src/notifications/entities';
import { GetInsitutionsFilterDto } from './dto/get-institutions-filter.dto';
import { MinioClientService } from '../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import * as archiver from 'archiver';
import { DateRangeDto } from './dto/generate-report-date.dto';
import { Logger } from 'src/logger/logger.service';

type TMaskedAdmin = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email_address?: string;
  date_of_birth?: Date;
};

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,

    @InjectRepository(NotificationSettings)
    private readonly notificationSettingsRepository: Repository<NotificationSettings>,

    private readonly emailService: EmailService,

    private readonly filterService: FilterService,

    private readonly redisService: RedisService,

    private dataSource: DataSource,

    private onboardingService: OnboardingService,

    private readonly i18n: I18nService,

    private readonly minioClientService: MinioClientService,

    private readonly configService: ConfigService,

    private readonly loggerService: Logger,
  ) {}

  private readonly collectionName = 'tokens';

  public async findLoggedInAdmin(userId: number, relations?: string[]): Promise<Admin> {
    return await this.adminRepository.findOne({
      where: {
        id: userId,
      },
      relations,
    });
  }

  private maskFields(obj: Partial<TMaskedAdmin>): Partial<TMaskedAdmin> {
    const fieldsToMask: Array<keyof TMaskedAdmin> = [
      'first_name',
      'last_name',
      'phone_number',
      'email_address',
      'date_of_birth',
    ];

    return fieldsToMask.reduce(
      (maskedObj, field) => {
        if (!maskedObj[field]) return maskedObj;

        if (field === 'date_of_birth') {
          const dayRegex = /^(\d{4}-\d{2})-\d{2}-?/;
          maskedObj[field] = new Date(maskedObj[field].toString().replace(dayRegex, '$1'));
        } else if (field === 'phone_number' || field === 'email_address') {
          maskedObj[field] = randomBytes(10).toString('hex');
        } else {
          const value = maskedObj[field];
          maskedObj[field] = '*'.repeat(value.length);
        }

        return maskedObj;
      },
      { ...obj },
    );
  }

  public async checkPropertyUniqueness(
    id: number,
    model: EntityTarget<Admin | Institution | User>,
    properties: Record<string, string>[],
  ): Promise<string[]> {
    const errors: string[] = [];
    const repository = this.dataSource.getRepository(model);

    for (const property of properties) {
      for (const [key, value] of Object.entries(property)) {
        if (value === undefined) continue;

        const foundProperty = await repository.findOne({
          where: {
            [key]: value,
            id: Not(id),
          },
        });

        if (foundProperty) {
          errors.push(key);
        }
      }
    }

    return errors;
  }

  private async removeUser(institutionId: number, seniorId: number, queryRunner: QueryRunner): Promise<TResponse> {
    const userToDelete = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: institutionId,
        },
      },
      relations: ['user_additional_info.documents', 'notes.attachments'],
    });

    if (!userToDelete) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Senior not found');
    }

    const imageToDelete = userToDelete?.image_name || '';
    const documentAttachmentsToDelete =
      userToDelete?.user_additional_info?.flatMap((info) => info?.documents?.map((document) => document.unique_name)) ||
      [];
    const noteAttachmentsToDelete =
      userToDelete?.notes?.flatMap((note) => note?.attachments?.map((attachment) => attachment.unique_name)) || [];

    const { bucketName, bucketNameDocuments, bucketNameNotes } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();

    await Promise.all([
      !!imageToDelete.length && s3Client.deleteObject({ Bucket: bucketName, Key: imageToDelete }),
      !!documentAttachmentsToDelete.length &&
        s3Client.deleteObjects({
          Bucket: bucketNameDocuments,
          Delete: { Objects: documentAttachmentsToDelete.map((doc) => ({ Key: doc })) },
        }),
      !!noteAttachmentsToDelete.length &&
        s3Client.deleteObjects({
          Bucket: bucketNameNotes,
          Delete: { Objects: noteAttachmentsToDelete.map((note) => ({ Key: note })) },
        }),
    ]);

    await queryRunner.manager.remove(userToDelete);
  }

  private async removeAdmin(institutionId: number, adminId: number, queryRunner: QueryRunner): Promise<TResponse> {
    const adminToDelete = await this.userRepository.findOne({
      where: {
        id: adminId,
        institution: {
          id: institutionId,
        },
      },
    });

    if (!adminToDelete) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Senior not found');
    }

    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id: adminToDelete.id,
        },
      },
    });

    if (address) {
      await queryRunner.manager.remove(address);
    }

    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id: adminToDelete.id,
        },
      },
    });

    if (onboarding) {
      await this.onboardingRepository.remove(onboarding);
    }

    const notificationSettings = await this.notificationSettingsRepository.findOne({
      where: {
        admin: {
          id: adminToDelete.id,
        },
      },
    });

    if (notificationSettings) {
      await this.notificationSettingsRepository.remove(notificationSettings);
    }

    await queryRunner.manager.remove(adminToDelete);
  }

  async getAllInstitutions(
    filterDto: GetInsitutionsFilterDto,
    headAdminId: number,
  ): Promise<TResponse<TArrayResponse<Institution>>> {
    const queryBuilder = this.institutionRepository
      .createQueryBuilder('institution')
      .leftJoinAndSelect('institution.status', 'status')
      .leftJoinAndSelect('institution.admins', 'admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.status', 'adminStatus')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('admin.country_id')
          .from(Admin, 'admin')
          .where('admin.id = :headAdminId', { headAdminId })
          .getQuery();
        return `admin.country_id = (${subQuery})`;
      });

    filterDto.sortBy = filterDto.sortBy || 'name';
    filterDto.sortOrder = filterDto.sortOrder || ESortOrder.ASC;

    const searchFields = ['institution.name', 'institution.email'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const institutions = await filteredQueryBuilder.getMany();

    const response = institutions.map((institution) => {
      const mappedInstitutions = {
        ...institution,
        superAdminId:
          institution.admins.find((admin) =>
            admin.roles.some((role) => role.role_name === ERole.SUPER_ADMIN_INSTITUTION),
          )?.id || null,
      };
      delete mappedInstitutions.admins;
      return mappedInstitutions;
    });

    const responseDetails = createResponseDetails<Institution>(response, filterDto, total);

    return createResponse(HttpStatus.OK, responseDetails, 'Institutions fetched');
  }

  async getInstitutionById(id: number, headAdminId: number): Promise<TResponse | TResponse<Institution>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const institution = await this.institutionRepository.findOne({
      where: { id },
      relations: ['status', 'admins', 'admins.country'],
    });

    if (!institution || headAdmin.country.id !== institution?.admins[0]?.country.id) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Institution not found');
    }
    delete institution.admins;

    return createResponse(HttpStatus.OK, institution, 'Institution details');
  }
  async findOneByFields({ email_address, phone_number }: Partial<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email_address, phone_number },
      relations: ['status', 'roles'],
    });
  }

  async setAdminStatus(
    id: number,
    { status }: SetStatusDto,
    role: ERole,
    userId?: number,
    headAdminId?: number,
  ): Promise<TResponse<string>> {
    const loggedInAdmin = userId && (await this.findLoggedInAdmin(userId, ['institution']));
    const headAdmin = headAdminId && (await this.findLoggedInAdmin(headAdminId, ['country']));

    const admin = await this.adminRepository.findOne({
      where: {
        id,
        roles: {
          role_name: role,
        },
        ...(userId && { institution: { id: loggedInAdmin.institution.id } }),
        ...(headAdmin && {
          country: {
            id: headAdmin.country.id,
          },
        }),
      },
      withDeleted: true,
      relations: ['status'],
    });

    if (!admin) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Admin not found');
    }

    if (admin.status.status_name === EStatus.CREATED) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        `Unable to change status, Admin currently has status ${EStatus.CREATED}.`,
      );
    }

    const updatedStatus = await this.statusRepository.findOne({
      where: {
        status_name: status,
      },
    });

    if (!updatedStatus) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Status not found', 'The specified status does not exist.');
    }

    if (admin.status && admin.status.id === updatedStatus.id) {
      return createResponse(HttpStatus.BAD_REQUEST, null, `Admin already has ${status} status`);
    }

    admin.status = updatedStatus;
    await this.adminRepository.update(id, admin);

    return createResponse(HttpStatus.OK, null, 'Admin status updated successfully');
  }

  async deleteAdmin(id: number, role: ERole, userId?: number, headAdminId?: number): Promise<TResponse> {
    const loggedInAdmin = userId && (await this.findLoggedInAdmin(userId, ['institution']));
    const headAdmin = headAdminId && (await this.findLoggedInAdmin(headAdminId, ['country']));

    const admin = await this.adminRepository.findOne({
      where: {
        id,
        roles: {
          role_name: role,
        },
        ...(userId && { institution: { id: loggedInAdmin.institution.id } }),
        ...(headAdmin && {
          country: {
            id: headAdmin.country.id,
          },
        }),
      },
      relations: ['status', 'users'],
    });

    if (!admin) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Admin not found');
    }
    if (role === ERole.FORMAL_CAREGIVER && admin.users.length > 0) {
      const numberOfUsers = admin.users.length;
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        `Caregiver has ${numberOfUsers} users assigned`,
        'You cannot delete caregivers who has users assigned to them.',
      );
    }

    const inactiveStatus = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.INACTIVE,
      },
    });

    if (!inactiveStatus) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Status not found', 'The specified status does not exist.');
    }

    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id,
        },
      },
    });

    if (address) {
      await this.addressRepository.remove(address);
    }

    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id,
        },
      },
    });

    if (onboarding) {
      await this.onboardingRepository.remove(onboarding);
    }

    const notificationSettings = await this.notificationSettingsRepository.findOne({
      where: {
        admin: {
          id,
        },
      },
    });

    if (notificationSettings) {
      await this.notificationSettingsRepository.remove(notificationSettings);
    }

    admin.status = inactiveStatus;
    admin.users = [];
    admin.password = null;

    const maskedAdmin = this.maskFields(admin);

    await this.adminRepository.save(maskedAdmin);
    await this.adminRepository.softDelete(admin.id);

    return createResponse(HttpStatus.OK, null, 'Admin deleted');
  }

  async addSuperInstitutionAdmin(
    { first_name, last_name, institution_name, email_address, phone_number }: AddSuperInstitutionAdminDto,
    headAdminId: number,
  ): Promise<TResponse> {
    const email = email_address.toLowerCase();
    const { country } = await this.adminRepository.findOne({
      where: { id: headAdminId },
      relations: ['country'],
    });

    const institution = new Institution();
    institution.name = institution_name;

    const createdStatus = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.CREATED,
      },
    });

    if (!createdStatus) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Status not found', 'The specified status does not exist.');
    }

    const role = await this.roleRepository.findOne({
      where: {
        role_name: ERole.SUPER_ADMIN_INSTITUTION,
      },
    });

    if (!role) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        'Role not found',
        `The specified role ${ERole.SUPER_ADMIN_INSTITUTION} does not exist.`,
      );
    }

    institution.status = createdStatus;

    const admin = new Admin();
    Object.assign(admin, {
      first_name,
      last_name,
      email_address: email,
      phone_number,
      institution,
      status: createdStatus,
      roles: [role],
      country,
    });

    await this.institutionRepository.save(institution);
    await this.adminRepository.save(admin);
    await this.onboardingService.createOnboardingObject(admin, 4);

    const token = generateKey();
    const hashedToken = await hashString(token);

    await this.redisService.saveItemToRedis(email_address, hashedToken, this.collectionName);
    await this.emailService.sendFirstEntryEmail(email_address, token);

    return createResponse(HttpStatus.OK, null, 'Admin and institution created, sent activation link via email.');
  }

  async getSuperInstitutionAdmin(id: number, headAdminId: number): Promise<TResponse<Admin>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const superInstitutionAdmin = await this.adminRepository.findOne({
      where: {
        id,
        roles: {
          role_name: ERole.SUPER_ADMIN_INSTITUTION,
        },
        country: {
          id: headAdmin.country.id,
        },
      },
      relations: ['status', 'institution', 'roles'],
    });

    if (!superInstitutionAdmin) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Admin not found');
    }

    return createResponse(HttpStatus.OK, superInstitutionAdmin, 'Super Institution Admin details');
  }

  async getSuperInstitutionAdmins(
    filterDto: GetSuperInsitutionAdminsFilterDto,
    headAdminId: number,
  ): Promise<TResponse<TArrayResponse<Admin>>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);

    const role = await this.roleRepository.findOne({
      where: { role_name: ERole.SUPER_ADMIN_INSTITUTION },
    });

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.institution', 'institution')
      .leftJoinAndSelect('admin.status', 'status')
      .andWhere('role.id = :roleId', { roleId: role.id })
      .andWhere('admin.id != :headAdminId', { headAdminId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('adminSub.id')
          .from(Admin, 'adminSub')
          .innerJoin('adminSub.country', 'country')
          .where('country.id = :headAdminCountryId', { headAdminCountryId: headAdmin.country.id })
          .getQuery();
        return `admin.id IN ${subQuery}`;
      });

    filterDto.sortBy = filterDto.sortBy || 'email_address';
    filterDto.sortOrder = filterDto.sortOrder || ESortOrder.ASC;

    const searchFields = ['institution.name'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const admins = await filteredQueryBuilder.getMany();

    const response = createResponseDetails<Admin>(admins, filterDto, total);

    return createResponse(HttpStatus.OK, response, 'Super Institution Admins');
  }

  async updateSuperInstitutionAdminDetails(
    id: number,
    headAdminId: number,
    { email_address, phone_number }: UpdateSuperInstitutionAdminDetailsDto,
  ): Promise<TResponse<Record<string, string[]>>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const superAdminToUpdate = await this.adminRepository.findOne({
      where: {
        id,
        roles: {
          role_name: ERole.SUPER_ADMIN_INSTITUTION,
        },
        country: {
          id: headAdmin.country.id,
        },
      },
      relations: ['roles'],
    });

    if (!superAdminToUpdate) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Super Institution Admin not found');
    }
    const nonUniqueProperties = await this.checkPropertyUniqueness(id, Admin, [
      {
        email_address,
        phone_number,
      },
    ]);
    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      return createResponse(HttpStatus.BAD_REQUEST, errors, 'Property already in use');
    }
    superAdminToUpdate.email_address = email_address;
    superAdminToUpdate.phone_number = phone_number;

    await this.adminRepository.save(superAdminToUpdate);

    return createResponse(HttpStatus.OK, null, 'Super Institution Admin details updated');
  }

  async updateInstitutionName(
    id: number,
    { name }: UpdateInstitutionNameDto,
    headAdminId: number,
  ): Promise<TResponse<Record<string, string[]>>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const superAdminToUpdate = await this.adminRepository.findOne({
      where: {
        id,
        roles: {
          role_name: ERole.SUPER_ADMIN_INSTITUTION,
        },
        country: {
          id: headAdmin.country.id,
        },
      },
      relations: ['roles', 'institution'],
    });

    if (!superAdminToUpdate) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Super Institution Admin not found');
    }

    if (!superAdminToUpdate.institution) {
      return createResponse(HttpStatus.NOT_FOUND, null, `Admin's Institution not found`);
    }

    const institution = await this.institutionRepository.findOne({
      where: {
        id: superAdminToUpdate.institution.id,
      },
    });

    if (!institution) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Institution not found');
    }
    const nonUniqueProperties = await this.checkPropertyUniqueness(superAdminToUpdate.institution.id, Institution, [
      { name },
    ]);
    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      return createResponse(HttpStatus.BAD_REQUEST, errors, 'Property already in use');
    }

    institution.name = name;

    await this.institutionRepository.save(institution);

    return createResponse(HttpStatus.OK, null, 'Institution name updated');
  }

  async updateInstitutionDetails(
    id: number,
    { ...updateData }: UpdateInstitutionDetailsDto,
    headAdminId: number,
  ): Promise<TResponse<null>> {
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const admin = await this.adminRepository.findOne({
      where: {
        id,
        country: {
          id: headAdmin.country.id,
        },
      },
      relations: ['institution'],
    });

    if (!admin) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Admin not found');
    }

    if (!admin.institution) {
      return createResponse(HttpStatus.BAD_REQUEST, null, "Admin doesn't have assigned institution");
    }

    await this.institutionRepository.update(admin.institution.id, updateData);
    return createResponse(HttpStatus.OK, null, 'Institution details updated');
  }

  async resendActivationLink(id: number, adminId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const loggedAdmin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['roles', 'institution', 'country'],
    });

    const admin = await this.adminRepository.findOne({
      where: {
        id,
      },
      relations: ['status', 'roles', 'institution', 'country'],
    });
    const countryLoggedAdmin = loggedAdmin?.country.id;
    const countryAdmin = admin?.country.id;

    if (!admin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.admin_not_found.notification.title`, { lang }),
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.admin_not_found.notification.message`, {
          lang,
        }),
      );
    }

    if (admin.status.status_name !== EStatus.CREATED) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.cannot_resend_link.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.cannot_resend_link.notification.message`, {
          lang,
        }),
      );
    }

    if (countryLoggedAdmin !== countryAdmin) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.forbidden.notification.title`, { lang }),
        this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.forbidden.notification.message`, { lang }),
      );
    }

    const token = generateKey();
    const hashedToken = await hashString(token);

    await this.redisService.saveItemToRedis(admin.email_address, hashedToken, this.collectionName, 3600);
    await this.emailService.sendFirstEntryEmail(admin.email_address, token);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.link_resent.notification.title`, { lang }),
      this.i18n.t(`${TAdminResponseKey}.service.RESEND_ACTIVATION_LINK.link_resent.notification.message`, { lang }),
    );
  }

  async changeInstitutionOwner(
    ownerId: number,
    { first_name, last_name, email_address, phone_number }: ChangeInstitutionOwnerDto,
    headAdminId: number,
  ): Promise<TResponse<{ newOwnerId: number }>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lang = I18nContext.current().lang;
      const headAdmin = headAdminId && (await this.findLoggedInAdmin(headAdminId, ['country']));
      const oldOwner = await this.adminRepository.findOne({
        where: {
          id: ownerId,
          roles: { role_name: ERole.SUPER_ADMIN_INSTITUTION },
          country: {
            id: headAdmin.country.id,
          },
        },
        relations: ['institution', 'institution.status'],
      });

      if (!oldOwner) {
        await queryRunner.rollbackTransaction();
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(`${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.owner_not_found.notification.title`, {
            lang,
          }),
          this.i18n.t(`${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.owner_not_found.notification.message`, {
            lang,
          }),
        );
      }

      const institutionId = oldOwner.institution.id;

      const institution = await this.institutionRepository.findOne({
        where: {
          id: institutionId,
          status: {
            status_name: Not(EStatus.INACTIVE),
          },
        },
      });

      if (!institution) {
        await queryRunner.rollbackTransaction();
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(
            `${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.institution_not_found.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.institution_not_found.notification.message`,
            { lang },
          ),
        );
      }

      const newStatus = await this.statusRepository.findOne({ where: { status_name: EStatus.CREATED } });
      const role = await this.roleRepository.findOne({ where: { role_name: ERole.SUPER_ADMIN_INSTITUTION } });

      const newOwner = new Admin();
      Object.assign(newOwner, {
        first_name,
        last_name,
        email_address,
        phone_number,
        institution,
        status: newStatus,
        roles: [role],
        country: headAdmin.country.id,
      });

      await queryRunner.manager.save(newOwner);

      const token = generateKey();
      const hashedToken = await hashString(token);

      await this.redisService.saveItemToRedis(email_address, hashedToken, this.collectionName);
      await this.emailService.sendFirstEntryEmail(email_address, token);

      await queryRunner.manager.remove(oldOwner);

      await queryRunner.commitTransaction();

      await this.onboardingService.createOnboardingObject(newOwner, 4);

      return createResponse(
        HttpStatus.OK,
        { newOwnerId: newOwner.id },
        this.i18n.t(`${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.institution_changed.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.CHANGE_INSTITUTION_OWNER.institution_changed.notification.message`, {
          lang,
        }),
      );
    } catch (error) {
      this.loggerService.log(error);
      await queryRunner.rollbackTransaction();
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Failed to change institution owner');
    } finally {
      await queryRunner.release();
    }
  }

  async deactivateInstitution(institutionId: number, headAdminId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const headAdmin = await this.findLoggedInAdmin(headAdminId, ['country']);
    const institution = await this.institutionRepository.findOne({
      where: {
        id: institutionId,
        status: { status_name: Not(EStatus.INACTIVE) },
        admins: { country: { id: headAdmin.country.id } },
      },
      relations: ['status', 'admins', 'admins.status', 'admins.country'],
    });

    if (!institution) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.institution_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.institution_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const inactiveStatus = await this.statusRepository.findOne({
      where: { status_name: EStatus.INACTIVE },
    });

    if (!inactiveStatus) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.status_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.status_not_found.notification.message`, {
          lang,
        }),
      );
    }

    institution.status = inactiveStatus;
    await this.institutionRepository.save(institution);

    const deactivateAdminUserPromises = institution.admins.map(async (admin) => {
      const users = await this.userRepository.find({
        where: {
          admins: {
            id: admin.id,
          },
        },
        relations: ['admins'],
      });
      users.map(async (user) => {
        user.status = inactiveStatus;
        await this.userRepository.save(user);
      });
      admin.status = inactiveStatus;
      return this.adminRepository.save(admin);
    });

    await Promise.all(deactivateAdminUserPromises);
    await this.redisService.removeSessionsFromRedisByInstitution(institutionId);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.deactivated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminResponseKey}.service.DEACTIVATE_INSTITUTION.deactivated.notification.message`, {
        lang,
      }),
    );
  }

  async activateInstitution(institutionId: number, headAdminId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const institution = await this.institutionRepository
      .createQueryBuilder('institution')
      .leftJoinAndSelect('institution.admins', 'admins')
      .leftJoinAndSelect('admins.status', 'admin_status')
      .leftJoinAndSelect('institution.status', 'status')
      .where('institution.id = :id', { id: institutionId })
      .andWhere('status.status_name = :inactiveStatus', { inactiveStatus: EStatus.INACTIVE })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('admin.country_id')
          .from(Admin, 'admin')
          .where('admin.id = :headAdminId', { headAdminId })
          .getQuery();
        return `admins.country_id = (${subQuery})`;
      })
      .select(['institution.id', 'status', 'admins.id', 'admins.password'])
      .getOne();

    if (!institution) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.institution_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.institution_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const activeStatus = await this.statusRepository.findOne({
      where: { status_name: EStatus.ACTIVE },
    });

    const createdStatus = await this.statusRepository.findOne({
      where: { status_name: EStatus.CREATED },
    });

    if (!activeStatus || !createdStatus) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.status_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.status_not_found.notification.message`, {
          lang,
        }),
      );
    }

    institution.status = activeStatus;
    await this.institutionRepository.save(institution);

    const activateAdminUsersPromises = institution.admins.map(async (admin) => {
      const users = await this.userRepository.find({
        where: {
          admins: {
            id: admin.id,
          },
        },
        relations: ['admins'],
      });
      users.map(async (user) => {
        user.status = activeStatus;
        await this.userRepository.save(user);
      });
      admin.status = admin.password ? activeStatus : createdStatus;
      return this.adminRepository.save(admin);
    });

    await Promise.all(activateAdminUsersPromises);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.activated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminResponseKey}.service.ACTIVATE_INSTITUTION.activated.notification.message`, {
        lang,
      }),
    );
  }

  async deleteInstitution(institutionId: number, headAdminId: number): Promise<TResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const institution = await this.institutionRepository.findOne({
        where: { id: institutionId },
        relations: ['admins', 'admins.institution', 'admins.country', 'admins.users'],
      });

      if (!institution) {
        await queryRunner.rollbackTransaction();
        return createResponse(HttpStatus.NOT_FOUND, null, 'Institution not found');
      }

      const headAdmin = await this.adminRepository.findOne({
        where: { id: headAdminId },
        relations: ['country'],
      });

      if (!headAdmin) {
        await queryRunner.rollbackTransaction();
        return createResponse(HttpStatus.NOT_FOUND, null, 'Head admin not found');
      }

      const headAdminCountry = headAdmin.country;

      const filteredAdmins = institution.admins.filter((admin) => admin.institution.id === institution.id);

      if (filteredAdmins.length) {
        for (const admin of filteredAdmins) {
          if (admin.country.id !== headAdminCountry.id) {
            await queryRunner.rollbackTransaction();
            return createResponse(
              HttpStatus.FORBIDDEN,
              null,
              'Cannot delete institution with admins from different countries',
            );
          }
        }

        for (const admin of filteredAdmins) {
          for (const user of admin.users) {
            await this.removeUser(institution.id, user.id, queryRunner);
          }
          await this.removeAdmin(institution.id, admin.id, queryRunner);
        }
      }
      await queryRunner.manager.remove(institution);

      await queryRunner.commitTransaction();
      return createResponse(HttpStatus.OK, null, 'Institution deleted successfully');
    } catch (error) {
      this.loggerService.log(error);
      await queryRunner.rollbackTransaction();
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Failed to delete institution');
    } finally {
      await queryRunner.release();
    }
  }

  async getLanguage(adminId: number): Promise<ELanguage> {
    const admin = await this.adminRepository.findOne({
      where: {
        id: adminId,
      },
      select: ['country'],
      relations: ['country'],
    });

    return admin.country.country_code;
  }

  private convertToCSV(data: string[]): string {
    if (!data.length) {
      return '';
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => (value !== null ? `"${value}"` : ''))
          .join(','),
      )
      .join('\n');

    return `${headers}\n${rows}`;
  }

  async generateReport(params: DateRangeDto, email_address: string): Promise<void> {
    const institutions = await this.institutionRepository.find();
    const { startDate, endDate } = params;

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const reportBuffer: Buffer[] = [];

    try {
      archive.on('data', (chunk) => reportBuffer.push(chunk));

      await Promise.all(
        institutions.map(async (institution) => {
          const { id, name } = institution;

          const query = `
          WITH date_series AS (
            SELECT generate_series('${startDate}'::date, '${endDate}'::date, '1 day'::interval) AS day
          ),
            latest_condition_assessment AS (
              SELECT DISTINCT ON (user_assessment.user_id, date_series.day)
                user_assessment.user_id,
                date_series.day,
                user_condition_assessment_scores.physical_activities_group,
                user_condition_assessment_scores.physical_activities_tier,
                user_condition_assessment_scores.social_abilities,
                user_condition_assessment_scores.quality_of_life,
                user_condition_assessment_scores.sleep_assessment
              FROM date_series
              JOIN user_assessment
                ON user_assessment.created_at::date <= date_series.day
              JOIN user_condition_assessment_scores
                ON user_condition_assessment_scores.user_assessment_id = user_assessment.id
                AND user_condition_assessment_scores.created_at::date <= date_series.day
              ORDER BY user_assessment.user_id, date_series.day, user_condition_assessment_scores.created_at DESC
            ),
            latest_quality_of_life AS (
              SELECT DISTINCT ON (user_quality_of_life.user_id, date_series.day)
                user_quality_of_life.user_id,
                date_series.day,
                user_quality_of_life.motivation,
                user_quality_of_life.general_health
              FROM date_series
              JOIN user_quality_of_life
                ON user_quality_of_life.created_at::date <= date_series.day
              ORDER BY user_quality_of_life.user_id, date_series.day, user_quality_of_life.created_at DESC
            )
            SELECT
              TO_CHAR(date_series.day, 'YYYY-MM-DD') AS "Date",
              users.id as "Senior ID",
              institutions.name as "Institution",
              TO_CHAR(users.date_of_birth, 'YYYY-MM-DD') as "Year of birth",
              COALESCE((
                SELECT moca_scoring
                FROM user_cognitive_abilities
                WHERE user_cognitive_abilities.user_id = users.id
                AND user_cognitive_abilities.created_at::date <= date_series.day
                ORDER BY user_cognitive_abilities.created_at DESC
                LIMIT 1
              )::TEXT, '-') as "MOCA Scoring",
              COALESCE(
                CASE 
                  WHEN latest_condition_assessment.physical_activities_group::TEXT = 'bedridden_activities' THEN 'Bedridden'
                  WHEN latest_condition_assessment.physical_activities_group::TEXT = 'without_limitation_activities' THEN 'Without Limitation'
                  WHEN latest_condition_assessment.physical_activities_group::TEXT = 'mobility_limitation_activities' THEN 'Mobility Limitation'
                  ELSE latest_condition_assessment.physical_activities_group::TEXT
              END, '-') as "Activity Group",
              COALESCE(latest_condition_assessment.physical_activities_tier::TEXT, '-') as "Recommended Activity Level",
              COALESCE(latest_condition_assessment.social_abilities::TEXT, '-') as "Social Abilities Assessment",
              COALESCE(latest_quality_of_life.motivation::TEXT, '-') as "Motivation level",
              COALESCE(latest_quality_of_life.general_health::TEXT, '-') as "General Health Score",
              COALESCE(latest_condition_assessment.quality_of_life, '-') as "Quality of life Assessment",
              COALESCE(latest_condition_assessment.sleep_assessment::TEXT, '-') as "Sleep Assessment",
                            COALESCE(
              COALESCE(COUNT(DISTINCT CASE 
                WHEN user_physical_activities_scores.created_at::date = date_series.day
                AND EXISTS (
                  SELECT 1
                  FROM user_physical_exercises
                  WHERE user_physical_exercises.name::TEXT = user_physical_activities_scores.name::TEXT
                ) THEN user_physical_activities_scores.id
              END), 0) || ' of ' ||
              COALESCE((
                SELECT
                  CASE
                    WHEN user_assigned_care_plan_history.activity_group = 'bedridden_activities'
                         AND user_assigned_care_plan_history.physical_activities_intensity = 'intense'
                      THEN user_assigned_care_plan_history.number_of_physical_exercises * 2
                    WHEN user_assigned_care_plan_history.activity_group = 'bedridden_activities'
                      THEN user_assigned_care_plan_history.number_of_physical_exercises
                    WHEN user_assigned_care_plan_history.activity_group != 'bedridden_activities'
                         AND user_assigned_care_plan_history.physical_activities_intensity = 'intense'
                      THEN user_assigned_care_plan_history.number_of_physical_exercises
                    WHEN user_assigned_care_plan_history.physical_activities_intensity = 'moderate'
                      THEN CASE
                          WHEN EXTRACT(DOW FROM date_series.day) BETWEEN 1 AND 5 THEN user_assigned_care_plan_history.number_of_physical_exercises
                          ELSE 0
                        END
                    WHEN user_assigned_care_plan_history.physical_activities_intensity = 'light'
                      THEN CASE
                          WHEN EXTRACT(DOW FROM date_series.day) IN (2, 4, 6) THEN user_assigned_care_plan_history.number_of_physical_exercises
                          ELSE 0
                        END
                    ELSE 0 
                  END
                FROM user_assigned_care_plan_history
                WHERE user_assigned_care_plan_history.user_id = users.id
                  AND user_assigned_care_plan_history.created_at::date <= date_series.day
                GROUP BY user_assigned_care_plan_history.activity_group, user_assigned_care_plan_history.physical_activities_intensity, user_assigned_care_plan_history.number_of_physical_exercises
                LIMIT 1
              ), (
                SELECT
                  CASE 
                    WHEN user_condition_assessment_scores.physical_activities_group = 'bedridden_activities' AND user_activities.physical_level = 'intense' THEN COUNT(*) * 2
                    WHEN user_condition_assessment_scores.physical_activities_group = 'bedridden_activities' THEN COUNT(*)
                    WHEN user_condition_assessment_scores.physical_activities_group != 'bedridden_activities' THEN
                      CASE
                        WHEN user_activities.physical_level = 'intense' THEN COUNT(*)
                        WHEN user_activities.physical_level = 'moderate' AND EXTRACT(DOW FROM date_series.day) BETWEEN 1 AND 5 THEN COUNT(*)
                        WHEN user_activities.physical_level = 'light' AND EXTRACT(DOW FROM date_series.day) IN (2, 4, 6) THEN COUNT(*)
                        ELSE 0
                      END
                    ELSE 0
                  END
                FROM user_activities_user_physical_exercises_user_physical_exercises
                JOIN user_activities
                  ON user_activities_user_physical_exercises_user_physical_exercises.user_activities_id = user_activities.id
                JOIN user_assessment
                  ON user_assessment.user_id = users.id
                JOIN user_condition_assessment_scores
                  ON user_condition_assessment_scores.user_assessment_id = user_assessment.id
                WHERE user_activities.user_id = users.id
                  AND user_condition_assessment_scores.created_at::date <= date_series.day
                GROUP BY user_condition_assessment_scores.physical_activities_group, user_activities.physical_level
                LIMIT 1
              )), '-') AS "Completed Physical Exercises",            
              COALESCE(
                COALESCE(COUNT(DISTINCT CASE 
                  WHEN user_physical_activities_scores.created_at::date = date_series.day
                  AND EXISTS (
                    SELECT 1
                    FROM user_breathing_exercises
                    WHERE user_breathing_exercises.name::TEXT = user_physical_activities_scores.name::TEXT
                  ) THEN user_physical_activities_scores.id
                END), 0) || ' of ' ||
                COALESCE((
                  SELECT
                    CASE
                      WHEN user_assigned_care_plan_history.activity_group = 'bedridden_activities'
                           AND user_assigned_care_plan_history.breathing_activities_intensity = 'intense'
                        THEN user_assigned_care_plan_history.number_of_breathing_activities * 2
                      WHEN user_assigned_care_plan_history.activity_group = 'bedridden_activities'
                        THEN user_assigned_care_plan_history.number_of_breathing_activities
                      WHEN user_assigned_care_plan_history.activity_group != 'bedridden_activities'
                           AND user_assigned_care_plan_history.breathing_activities_intensity = 'intense'
                        THEN user_assigned_care_plan_history.number_of_breathing_activities
                      WHEN user_assigned_care_plan_history.breathing_activities_intensity = 'moderate'
                        THEN CASE
                            WHEN EXTRACT(DOW FROM date_series.day) BETWEEN 1 AND 5 THEN user_assigned_care_plan_history.number_of_breathing_activities
                            ELSE 0
                          END
                      WHEN user_assigned_care_plan_history.breathing_activities_intensity = 'light'
                        THEN CASE
                            WHEN EXTRACT(DOW FROM date_series.day) IN (1, 3, 5) THEN user_assigned_care_plan_history.number_of_breathing_activities
                            ELSE 0
                          END
                      ELSE 0 
                    END
                  FROM user_assigned_care_plan_history
                  WHERE user_assigned_care_plan_history.user_id = users.id
                    AND user_assigned_care_plan_history.created_at::date <= date_series.day
                  GROUP BY user_assigned_care_plan_history.activity_group, user_assigned_care_plan_history.breathing_activities_intensity, user_assigned_care_plan_history.number_of_breathing_activities
                  LIMIT 1
                ), (
                  SELECT
                    CASE 
                      WHEN user_condition_assessment_scores.physical_activities_group = 'bedridden_activities' AND user_activities.breathing_level = 'intense' THEN COUNT(*) * 2
                      WHEN user_condition_assessment_scores.physical_activities_group = 'bedridden_activities' THEN COUNT(*)
                      WHEN user_condition_assessment_scores.physical_activities_group != 'bedridden_activities' THEN
                        CASE
                          WHEN user_activities.breathing_level = 'intense' THEN COUNT(*)
                          WHEN user_activities.breathing_level = 'moderate' AND EXTRACT(DOW FROM date_series.day) BETWEEN 1 AND 5 THEN COUNT(*)
                          WHEN user_activities.breathing_level = 'light' AND EXTRACT(DOW FROM date_series.day) IN (1, 3, 5) THEN COUNT(*)
                          ELSE 0
                        END
                      ELSE 0
                    END
                  FROM use_act_use_bre_exe_use_bre_exe
                  JOIN user_activities
                    ON use_act_use_bre_exe_use_bre_exe.user_activities_id = user_activities.id
                  JOIN user_assessment
                    ON user_assessment.user_id = users.id
                  JOIN user_condition_assessment_scores
                    ON user_condition_assessment_scores.user_assessment_id = user_assessment.id
                  WHERE user_activities.user_id = users.id
                    AND user_condition_assessment_scores.created_at::date <= date_series.day
                  GROUP BY user_condition_assessment_scores.physical_activities_group, user_activities.breathing_level
                  LIMIT 1
                )), '-') AS "Completed Breathing Exercises",
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM user_assigned_care_plan_history
                WHERE user_assigned_care_plan_history.user_id = users.id
                  AND user_assigned_care_plan_history.created_at::date <= date_series.day
                  AND user_assigned_care_plan_history.walking_exercise = true
              ) THEN
                CASE
                  WHEN EXISTS (
                    SELECT 1
                    FROM user_physical_activities_scores
                    WHERE user_physical_activities_scores.user_activities_id = user_activities.id
                      AND user_physical_activities_scores.created_at::date = date_series.day
                      AND user_physical_activities_scores.name = 'walking_exercise'
                  ) THEN 'Yes'
                  ELSE 'No'
                END
              WHEN EXISTS (
                SELECT 1
                FROM user_assigned_care_plan_history
                WHERE user_assigned_care_plan_history.user_id = users.id
                  AND user_assigned_care_plan_history.created_at::date <= date_series.day
                  AND user_assigned_care_plan_history.walking_exercise = false
              ) THEN '-'
              WHEN EXISTS (
                SELECT 1
                FROM user_activities
                WHERE user_activities.user_id = users.id
                  AND user_activities.user_walking_exercises_id IS NOT NULL
                  AND user_activities.created_at::date <= date_series.day
              ) THEN
                CASE
                  WHEN EXISTS (
                    SELECT 1
                    FROM user_physical_activities_scores
                    WHERE user_physical_activities_scores.user_activities_id = user_activities.id
                      AND user_physical_activities_scores.created_at::date = date_series.day
                      AND user_physical_activities_scores.name = 'walking_exercise'
                  ) THEN 'Yes'
                  ELSE 'No'
                END
              ELSE '-'
            END AS "Walking Exercise Completed",
              COALESCE(ROUND(ss.total_time / 60)::TEXT || ' min', '0 min') AS "Time spent on gameplay (summary)",
              COALESCE(ss.total_gameplays, '0') AS "Number of all gameplays",

              COUNT(DISTINCT user_personal_growth.id) || ' of ' || (SELECT COUNT(*) FROM user_personal_growth_challenges) as "Number of completed personal growth challenges",
              
              COALESCE(ROUND(ss.sudoku_time / 60)::TEXT || 'min', '0min') as "Sudoku game time",
              COALESCE(ss.sudoku_level::TEXT, '-') as "Sudoku level",
              COALESCE(
              ROUND(100 * ss.sudoku_wins::numeric / NULLIF(ss.sudoku_plays, 0))::TEXT || '%', '-') as "Sudoku - number of won games in percentage",

              COALESCE(ROUND(ss.game_2048_time / 60)::TEXT || 'min', '0min') as "Game 2048 game time",
              COALESCE(ss.game_2048_level::TEXT, '-') as "Game 2048 level",
              COALESCE(
              ROUND(100 * ss.game_2048_wins::numeric / NULLIF(ss.game_2048_plays, 0))::TEXT || '%', '-') as "Game 2048 - number of won games in percentage",

              COALESCE(ROUND(ss.wordle_time / 60)::TEXT || 'min', '0min') as "Wordle game time",
              COALESCE(ss.wordle_level::TEXT, '-') as "Wordle level",
              COALESCE(
              ROUND(100 * ss.wordle_wins::numeric / NULLIF(ss.wordle_plays, 0))::TEXT || '%', '-') as "Wordle - number of won games in percentage",

              COALESCE(ROUND(ss.memory_time / 60)::TEXT || 'min', '0min') as "Memory game time",
              COALESCE(ss.memory_level::TEXT, '-') as "Memory level",
              COALESCE(
              ROUND(100 * ss.memory_wins::numeric / NULLIF(ss.memory_plays, 0))::TEXT || '%', '-') as "Memory - number of won games in percentage",

              COALESCE(ROUND(ss.word_guess_time / 60)::TEXT || 'min', '0min') as "Word guess game time",
              COALESCE(ss.word_guess_level::TEXT, '-') as "Word guess level",
              COALESCE(
              ROUND(100 * ss.word_guess_wins::numeric / NULLIF(ss.word_guess_plays, 0))::TEXT || '%', '-') as "Word guess - number of won games in percentage",

              COALESCE(ROUND(ss.snake_time / 60)::TEXT || 'min', '0min') as "Snake game time",
              COALESCE(ss.snake_level::TEXT, '-') as "Snake level",
              COALESCE(
              ROUND(100 * ss.snake_wins::numeric / NULLIF(ss.snake_plays, 0))::TEXT || '%', '-') as "Snake - number of won games in percentage",

              COALESCE(ROUND(ss.tic_tac_toe_time / 60)::TEXT || 'min', '0min') as "Tic tac toe game time",
              COALESCE(ss.tic_tac_toe_level::TEXT, '-') as "Tic tac toe level",
              COALESCE(
              ROUND(100 * ss.tic_tac_toe_wins::numeric / NULLIF(ss.tic_tac_toe_plays, 0))::TEXT || '%', '-') as "Tic tac toe - number of won games in percentage"
            
            FROM date_series
              JOIN users
                ON users.created_at::date <= date_series.day
                AND users.institution_id = ${id}
              
              LEFT JOIN (
                SELECT
                user_id,
                created_at::date AS day,
                  SUM(completion_time) AS total_time,
                  COUNT(*) AS total_gameplays,

                  SUM(CASE WHEN game_name = 'sudoku' THEN completion_time ELSE 0 END) AS sudoku_time,
                  SUM(CASE WHEN game_name = 'game_2048' THEN completion_time ELSE 0 END) AS game_2048_time,
                  SUM(CASE WHEN game_name = 'wordle' THEN completion_time ELSE 0 END) AS wordle_time,
                  SUM(CASE WHEN game_name = 'memory' THEN completion_time ELSE 0 END) AS memory_time,
                  SUM(CASE WHEN game_name = 'word_guess' THEN completion_time ELSE 0 END) AS word_guess_time,
                  SUM(CASE WHEN game_name = 'snake' THEN completion_time ELSE 0 END) AS snake_time,
                  SUM(CASE WHEN game_name = 'tic_tac_toe' THEN completion_time ELSE 0 END) AS tic_tac_toe_time,

                  SUM(CASE WHEN game_name = 'sudoku' THEN 1 ELSE 0 END) AS sudoku_plays,
                  SUM(CASE WHEN game_name = 'sudoku' AND completed THEN 1 ELSE 0 END) AS sudoku_wins,
                  MAX(CASE WHEN game_name = 'sudoku' THEN game_level END) AS sudoku_level,

                  SUM(CASE WHEN game_name = 'game_2048' THEN 1 ELSE 0 END) AS game_2048_plays,
                  SUM(CASE WHEN game_name = 'game_2048' AND completed THEN 1 ELSE 0 END) AS game_2048_wins,
                  MAX(CASE WHEN game_name = 'game_2048' THEN game_level END) AS game_2048_level,

                  SUM(CASE WHEN game_name = 'wordle' THEN 1 ELSE 0 END) AS wordle_plays,
                  SUM(CASE WHEN game_name = 'wordle' AND completed THEN 1 ELSE 0 END) AS wordle_wins,
                  MAX(CASE WHEN game_name = 'wordle' THEN game_level END) AS wordle_level,

                  SUM(CASE WHEN game_name = 'memory' THEN 1 ELSE 0 END) AS memory_plays,
                  SUM(CASE WHEN game_name = 'memory' AND completed THEN 1 ELSE 0 END) AS memory_wins,
                  MAX(CASE WHEN game_name = 'memory' THEN game_level END) AS memory_level,

                  SUM(CASE WHEN game_name = 'word_guess' THEN 1 ELSE 0 END) AS word_guess_plays,
                  SUM(CASE WHEN game_name = 'word_guess' AND completed THEN 1 ELSE 0 END) AS word_guess_wins,
                  MAX(CASE WHEN game_name = 'word_guess' THEN game_level END) AS word_guess_level,

                  SUM(CASE WHEN game_name = 'snake' THEN 1 ELSE 0 END) AS snake_plays,
                  SUM(CASE WHEN game_name = 'snake' AND completed THEN 1 ELSE 0 END) AS snake_wins,
                  MAX(CASE WHEN game_name = 'snake' THEN game_level END) AS snake_level,

                  SUM(CASE WHEN game_name = 'tic_tac_toe' THEN 1 ELSE 0 END) AS tic_tac_toe_plays,
                  SUM(CASE WHEN game_name = 'tic_tac_toe' AND completed THEN 1 ELSE 0 END) AS tic_tac_toe_wins,
                  MAX(CASE WHEN game_name = 'tic_tac_toe' THEN game_level END) AS tic_tac_toe_level
                FROM scores
                WHERE created_at::date BETWEEN '${startDate}' AND '${endDate}'
                GROUP BY user_id, created_at::date
                ) ss
                ON ss.user_id = users.id
                AND ss.day = date_series.day

              LEFT JOIN user_activities 
                ON user_activities.user_id = users.id 
              LEFT JOIN user_personal_growth
                ON user_personal_growth.user_activities_id = user_activities.id
                AND user_personal_growth.completed = TRUE
              LEFT JOIN user_cognitive_abilities
                ON user_cognitive_abilities.user_id = users.id
                AND user_cognitive_abilities.created_at BETWEEN '${startDate}' AND '${endDate}'
              LEFT JOIN user_assessment
                ON user_assessment.user_id = users.id
                AND user_assessment.created_at BETWEEN '${startDate}' AND '${endDate}'
              LEFT JOIN latest_condition_assessment
                ON latest_condition_assessment.user_id = users.id
                AND latest_condition_assessment.day = date_series.day
              LEFT JOIN latest_quality_of_life
                ON latest_quality_of_life.user_id = users.id
                AND latest_quality_of_life.day = date_series.day
             LEFT JOIN user_physical_activities_scores
                ON user_physical_activities_scores.user_activities_id = user_activities.id
                AND user_physical_activities_scores.created_at::date = date_series.day
              LEFT JOIN institutions
                ON institutions.id = users.institution_id
              GROUP BY
                users.id,
                latest_condition_assessment.physical_activities_group,
                latest_condition_assessment.physical_activities_tier,
                latest_condition_assessment.social_abilities,
                latest_condition_assessment.quality_of_life,
                latest_condition_assessment.sleep_assessment,
                latest_quality_of_life.motivation,
                latest_quality_of_life.general_health,
                date_series.day,
                user_activities.id,
                institutions.name,
                ss.total_time, ss.total_gameplays,
                ss.sudoku_time, ss.sudoku_level, ss.sudoku_plays, ss.sudoku_wins,
                ss.game_2048_time, ss.game_2048_level, ss.game_2048_plays, ss.game_2048_wins,
                ss.wordle_time, ss.wordle_level, ss.wordle_plays, ss.wordle_wins,
                ss.memory_time, ss.memory_level, ss.memory_plays, ss.memory_wins,
                ss.word_guess_time, ss.word_guess_level, ss.word_guess_plays, ss.word_guess_wins,
                ss.snake_time, ss.snake_level, ss.snake_plays, ss.snake_wins,
                ss.tic_tac_toe_time, ss.tic_tac_toe_level, ss.tic_tac_toe_plays, ss.tic_tac_toe_wins
              ORDER BY "Senior ID" DESC, "Institution", "Date"
          `;
          const data = await this.dataSource.query(query);
          const csv = this.convertToCSV(data);
          const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');
          const fileName = `${safeName}_report.csv`;
          archive.append(csv, { name: fileName });
        }),
      );
      await archive.finalize();
      await this.emailService.sendGeneratedReport(email_address, startDate, endDate, Buffer.concat(reportBuffer));
      console.log(`Report generated and sent to ${email_address} via e-mail.`);
    } catch (error) {
      archive.abort();
      this.loggerService.log(error);
    }
  }
}
