import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, QueryRunner, Repository } from 'typeorm';
import { TArrayResponse, TResponse } from '../../common/types';
import { EContactType, ERelationshipToSenior, ERole, EStatus, TGetTranslations } from '../types';
import { createResponse } from '../../common/responses/createResponse';
import { Admin, Onboarding, Role, Status } from '../entities';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../common/entities/address.entity';
import {
  AddFamilyDoctorDto,
  AddPhysicalActivitiesDto,
  AddQualityOfLifeDto,
  AddSleepAssessmentDto,
  AddSocialAbilitiesDto,
  AddUserDto,
  CheckIfInformalCaregiverExistsDto,
  GetDocumentsFilterDto,
  GetInformalCaregiverExists,
  GetUserMobilityLevel,
  GetUsersAdditionalFilters,
  GetUsersFilterDto,
} from './dto';
import { UserContact } from './entities/userContact.entity';
import { UserSleepAssessment } from './entities/userSleepAssessment.entity';
import { UserSocialAbilities } from './entities/userSocialAbilities.entity';
import {
  AddInformalCaregiverDto,
  AddressDto,
  UpdateBasicInformationDto,
  UpdateCaregiverContactDto,
  UpdateContactBaseDto,
  UpdateContactDto,
  UpdateInfoDto,
} from '../admin-institution/dto';
import { AdminService } from '../admin.service';
import { UserPhysicalActivities } from './entities/userPhysicalActivities.entity';
import { UserQualityOfLife } from './entities/userQualityOfLife.entity';
import { FileArray } from 'src/notes/types';
import { MinioClientService } from 'src/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { UserAdditionalInfo } from './entities/userAdditionalInfo.entity';
import { Attachment } from 'src/notes/entities/attachment.entity';
import {
  EActivityLevel,
  EEnthusiasmLevel,
  EFrequency,
  EPriority,
  EProblemsLevel,
  ESeniorFormType,
  ESleepQuality,
  ESocialAbilitiesResponseType,
  EUserAssessmentAreas,
  EUserCognitiveAbilitiesGroup,
  EUserPhysicalActivityGroup,
  PersonalDetails,
  SeniorDocumentsFilesArray,
  TContactWithAddress,
  TGetDocuments,
  TSecurityCode,
  TSocialAbilityScores,
  UpdateSeniorResponseErrors,
  UserWithImage,
  TDocumentContentPayload,
  EMotivationPerformance,
} from './types';
import { OnboardingService } from '../../common/utils/create-onboarding';
import { UserCognitiveAbilities } from './entities/userCognitiveAbilities.entity';
import { AdminInstitutionService } from '../admin-institution/admin-institution.service';
import { AddUserAssessmentDto } from './dto/add-user-assessment.dto';
import { UserAssessment } from './entities/userAssessment.entity';
import { AddCognitiveAbilitiesDto } from './dto/add-cognitive-abilities.dto';
import { UserConditionAssessmentScores } from './entities/userConditionAssesmentScores.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import {
  TAdminCaregiverResponseKey,
  TCommonResponseKey,
  TAssessmentReportAnswerKeys,
} from '../../common/utils/translationKeys';
import { AddSupportingContactDto } from './dto/supporting-contact.dto';
import { UserRelationships } from './entities/userRelationships.entity';
import { FilterService } from '../../filter/filter.service';
import { createResponseDetails } from '../../common/responses/createResponseDetails';
import { UserActivities } from './entities/userActivities.entity';
import { UserDocuments } from './entities/userDocuments.entity';
import * as stream from 'node:stream';
import { Readable } from 'node:stream';
import { OptionalNestedPaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { createOptionalPaginatedResponse } from '../../common/responses/createPaginatedResponse';
import { NestedPagination } from '../../common/dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from '../../redis/redis.service';
import * as libre from 'libreoffice-convert';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { promisify } from 'util';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { DashboardsService } from './dashboards/dashboards.service';
import { TSeniorsPerformance } from './dashboards/types';
import { ENotificationPriority, ENotificationTitle } from 'src/notifications/types';
import { Logger } from '../../logger/logger.service';

type TMaskedUser = {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email_address?: string;
  date_of_birth?: Date;
};

@Injectable()
export class CaregiverService {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminInstitutionService: AdminInstitutionService,
    private readonly configService: ConfigService,
    private readonly minioClientService: MinioClientService,
    private readonly notificationService: NotificationsService,
    private readonly i18n: I18nService,
    private onboardingService: OnboardingService,
    private dataSource: DataSource,
    private readonly filterService: FilterService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly dashboardsService: DashboardsService,
    private readonly loggerService: Logger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(UserContact)
    private readonly userContactRepository: Repository<UserContact>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @InjectRepository(UserAdditionalInfo)
    private readonly userAdditionalInfoRepository: Repository<UserAdditionalInfo>,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    @InjectRepository(UserAssessment)
    private readonly userAssessmentRepository: Repository<UserAssessment>,
    @InjectRepository(UserConditionAssessmentScores)
    private readonly userConditionAssessmentScoresRepository: Repository<UserConditionAssessmentScores>,
    @InjectRepository(UserRelationships)
    private readonly userRelationshipsRepository: Repository<UserRelationships>,
    @InjectRepository(UserActivities)
    private readonly userActivitiesRepository: Repository<UserActivities>,
    @InjectRepository(UserDocuments)
    private readonly userDocumentsRepository: Repository<UserDocuments>,
  ) {}

  private async paginateCaregivers(
    userId: number,
    paginationParams?: OptionalNestedPaginationParamsDto,
  ): Promise<{ items: Admin[]; pagination: NestedPagination | null }> {
    const query = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'roles')
      .leftJoinAndSelect('admin.caregiver_roles', 'caregiver_roles')
      .leftJoin('admin.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('roles.role_name IN (:...roleNames)', {
        roleNames: [ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER],
      });

    if (paginationParams.pageSize || paginationParams.page) {
      const { page = 1, pageSize = 10 } = paginationParams;
      const [items, total] = await query
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      return createOptionalPaginatedResponse(items, total, paginationParams);
    } else {
      const items = await query.getMany();
      return { items, pagination: null };
    }
  }

  private async saveEntity<T>(repository: Repository<T>, entity: T, queryRunner?: QueryRunner): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.save(entity);
    } else {
      await repository.save(entity);
    }
  }

  private async assignAddress(address: AddressDto, newContact: UserContact): Promise<void> {
    const addressEntity = new Address();
    Object.assign(addressEntity, address);
    addressEntity.user_contact = newContact;

    await this.addressRepository.save(addressEntity);
  }

  public async isUserAssignedToAdmin(userId: number, seniorId: number): Promise<boolean> {
    const user = await this.adminRepository.findOne({
      where: {
        id: userId,
        users: {
          id: seniorId,
        },
      },
    });

    return !!user;
  }

  private async setStepToTrue(form_type: ESeniorFormType, id: number, step: number): Promise<void> {
    const addSeniorForm = await this.onboardingRepository.findOne({
      where: {
        form_type,
        user: {
          id,
        },
      },
    });

    addSeniorForm[`step${step}`] = true;
    await this.onboardingRepository.save(addSeniorForm);
  }

  private calculateHoursInBed = (bedTime: string, wakeUpTime: string): number => {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(':').map(Number);

    const bedTimeMinutes = bedHour * 60 + bedMinute;
    let wakeUpTimeMinutes = wakeHour * 60 + wakeMinute;

    if (wakeUpTimeMinutes < bedTimeMinutes) {
      wakeUpTimeMinutes += 24 * 60;
    }

    const totalMinutesInBed = wakeUpTimeMinutes - bedTimeMinutes;
    return totalMinutesInBed / 60;
  };

  private maskFields(obj: Partial<TMaskedUser>): Partial<TMaskedUser> {
    const fieldsToMask: Array<keyof TMaskedUser> = [
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

  async addUser(addUserDto: AddUserDto, caregiverId: number): Promise<TResponse<number>> {
    const lang = I18nContext.current().lang;
    const status = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.CREATED,
      },
    });

    if (!status) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER.status_not_found.notification.title`, { lang }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER.status_not_found.notification.message`, {
          lang,
          args: { property: EStatus.CREATED },
        }),
      );
    }

    const admin = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
      },
      relations: ['institution', 'users'],
    });
    if (!admin) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TCommonResponseKey}.admin_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.admin_not_found.notification.message`, { lang }),
      );
    }
    const newUser = new User();
    const email_address = addUserDto.email_address?.toLowerCase();

    Object.assign(newUser, {
      status,
      ...addUserDto,
      email_address,
      created_by: admin.id,
      institution: admin.institution,
    });

    await this.userRepository.save(newUser);
    admin.users.push(newUser);
    await this.adminRepository.save(admin);

    await this.onboardingService.createOnboardingObject(newUser, 4, ESeniorFormType.PERSONAL_DETAILS, true);

    if (newUser.email_address) {
      await this.sendLandingPageLinkViaEmail(caregiverId, newUser.id);
    }

    return createResponse(
      HttpStatus.CREATED,
      newUser.id,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER.user_added.notification.title`, { lang }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER.user_added.notification.message`, { lang }),
    );
  }

  async getUsers(
    caregiverId: number,
    filterDto: GetUsersFilterDto,
    additionalFilters: GetUsersAdditionalFilters,
  ): Promise<TResponse<TArrayResponse<UserWithImage>>> {
    const lang = I18nContext.current().lang;

    const queryBuilder = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.status', 'status')
      .leftJoinAndSelect('users.assessments', 'assessment')
      .leftJoinAndSelect('users.admins', 'admins')
      .leftJoinAndSelect('users.userActivities', 'userActivities')
      .where('admins.id = :caregiverId', { caregiverId });

    const searchFields = ['users.first_name', 'users.last_name'];

    const filteredQueryBuilder = this.filterService.applyFilters(
      queryBuilder,
      filterDto,
      searchFields,
      additionalFilters,
    );
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const users = await filteredQueryBuilder.getMany();

    const usersWithImage = await Promise.all(
      users.map(async (user) => {
        const performance_warning = await this.userPerformanceWarning(user.id);
        const imageResponse = await this.adminInstitutionService.getImage(user.id, User);
        const assessment_completed = !!user.assessments.length;
        const image = typeof imageResponse.details === 'string' ? imageResponse.details : null;
        const userWithAvatar: UserWithImage = {
          ...user,
          image,
          assessment_completed,
          activities_assigned: !!user.userActivities,
          performance_warning,
        };
        delete userWithAvatar.assessments;
        delete userWithAvatar.userActivities;
        return userWithAvatar;
      }),
    );
    const response = createResponseDetails(usersWithImage, filterDto, total);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_USERS.users_fetched.notification.title`, { lang }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_USERS.users_fetched.notification.message`, { lang }),
    );
  }

  async updateUserInfo(
    updateUserDto: UpdateInfoDto,
    caregiverId: number,
    userId: number,
    queryRunner?: QueryRunner,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        admins: {
          id: caregiverId,
        },
      },
    });
    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    Object.assign(user, updateUserDto);
    await this.saveEntity(this.userRepository, user, queryRunner);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_USER_INFO.data_updated.notification.title`, { lang }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_USER_INFO.data_updated.notification.message`, { lang }),
    );
  }

  async getMyUser(caregiverId: number): Promise<TResponse<number>> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        admins: {
          id: caregiverId,
        },
      },
    });
    if (!user) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }
    return createResponse(
      HttpStatus.OK,
      user.id,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MY_USER.user_fetched.notification.title`, { lang }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MY_USER.user_fetched.notification.message`, { lang }),
    );
  }

  async updateContactToUser(
    updateUserDto: UpdateContactBaseDto,
    caregiverId: number,
    userId: number,
    queryRunner?: QueryRunner,
  ): Promise<TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        admins: {
          id: caregiverId,
        },
      },
    });
    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }
    const { email_address, phone_number } = updateUserDto;
    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(userId, User, [
      { email_address, phone_number },
    ]);
    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});
    if (Object.keys(errors).length > 0) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        errors,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_CONTACT_TO_USER.property_in_use.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_CONTACT_TO_USER.property_in_use.notification.message`,
          { lang },
        ),
      );
    }
    if (email_address || phone_number) {
      user.email_address = email_address || user.email_address;
      user.phone_number = phone_number || user.phone_number;
      await this.saveEntity(this.userRepository, user, queryRunner);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_CONTACT_TO_USER.data_updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_CONTACT_TO_USER.data_updated.notification.message`, {
        lang,
      }),
    );
  }

  async assignUsersAddress(
    addressDto: AddressDto,
    caregiverId: number,
    userId: number,
    queryRunner?: QueryRunner,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }
    const usersAddress = await this.addressRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    const address = usersAddress || new Address();

    Object.assign(address, addressDto);
    address.user = user;
    if (queryRunner) {
      await queryRunner.manager.save(address);
    } else {
      await this.addressRepository.save(address);
    }
    const existingSteps = await this.onboardingRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        form_type: ESeniorFormType.PERSONAL_DETAILS,
      },
    });
    if (existingSteps) {
      await this.setStepToTrue(ESeniorFormType.PERSONAL_DETAILS, userId, 2);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ASSIGN_USERS_ADDRESS.address_updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ASSIGN_USERS_ADDRESS.address_updated.notification.message`, {
        lang,
      }),
    );
  }

  async executeTransaction<T>(
    queryRunner: QueryRunner,
    operations: (() => Promise<TResponse<Record<string, string[]>>>)[],
    message: string = 'Data successfully updated',
  ): Promise<TResponse<T>> {
    const lang = I18nContext.current().lang;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const results = await Promise.all(operations.map((op) => op()));
    const hasError = results.some((result) => result.status !== HttpStatus.OK && result.status !== HttpStatus.CREATED);

    if (hasError) {
      const errorsDetails = results.reduce((acc, result) => ({ ...acc, ...result.details }), {}) as T;
      await queryRunner.rollbackTransaction();
      return createResponse(
        HttpStatus.BAD_REQUEST,
        errorsDetails,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.EXECUTE_TRANSACTION.failed_to_update.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.EXECUTE_TRANSACTION.failed_to_update.notification.message`, {
          lang,
        }),
      );
    }

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return createResponse(HttpStatus.OK, null, message);
  }

  async assignUsersAddressAndContact(
    updateUserDto: UpdateContactDto,
    caregiverId: number,
    userId: number,
  ): Promise<TResponse<UpdateSeniorResponseErrors>> {
    const { phone_number, email_address, address } = updateUserDto;
    const queryRunner = this.dataSource.createQueryRunner();

    const operations = [
      (): Promise<TResponse<Record<string, string[]>>> =>
        this.updateContactToUser({ phone_number, email_address }, caregiverId, userId, queryRunner),
      (): Promise<TResponse> => this.assignUsersAddress(address, caregiverId, userId, queryRunner),
    ];

    return this.executeTransaction(queryRunner, operations);
  }

  async getUserInfo(
    userId: number,
    caregiverId: number,
    paginationParams?: OptionalNestedPaginationParamsDto,
  ): Promise<TResponse<User>> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        admins: {
          id: caregiverId,
        },
      },
      relations: ['created_by'],
    });
    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const caregivers = await this.paginateCaregivers(userId, paginationParams);

    const usersAddress = await this.addressRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    const assessment = await this.userAssessmentRepository.findOne({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['user_condition_assessment_scores'],
      order: {
        created_at: 'DESC',
      },
    });

    let assessment_completed = false;
    let activities_assigned = null;

    if (assessment) {
      assessment_completed = true;
      activities_assigned = false;
      const trainingAssigned = await this.userActivitiesRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });
      if (trainingAssigned) {
        activities_assigned = true;
      }
    }

    const { details } = await this.adminInstitutionService.getImage(user.id, User);
    const image = typeof details === 'string' ? details : null;
    const activity_group = assessment?.user_condition_assessment_scores?.physical_activities_group;
    const performance_warning = await this.userPerformanceWarning(userId);

    const response = {
      ...user,
      caregivers,
      address: usersAddress,
      image,
      assessment_completed,
      activities_assigned,
      activity_group,
      performance_warning,
    };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_USER_INFO.user_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_USER_INFO.user_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async assignInformalCaregiverAsSupportingContactToSenior(
    userId: number,
    caregiverId: number,
    seniorId: number,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const informalCaregiver = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
        roles: {
          role_name: ERole.INFORMAL_CAREGIVER,
        },
      },
      relations: ['users'],
    });

    if (!informalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.ic_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.ic_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: userId,
        },
      },
      relations: ['admins', 'admins.roles'],
    });

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const isSeniorAlreadyAssigned = informalCaregiver.users.some((user) => user.id === seniorId);

    if (isSeniorAlreadyAssigned) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_already_assigned.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_already_assigned.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const informalCaregiverAssigned = senior.admins.some((admin) =>
      admin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
    );

    if (informalCaregiverAssigned) {
      return createResponse(
        HttpStatus.CONFLICT,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_already_assigned_different_IC.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.senior_already_assigned_different_IC.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const existingSupportingContact = await this.userContactRepository.findOne({
      where: {
        email_address: informalCaregiver.email_address,
        relation: {
          relations: ERelationshipToSenior.INFORMAL_CAREGIVER,
        },
      },
      relations: ['user'],
    });

    if (existingSupportingContact) {
      if (existingSupportingContact.user?.id === seniorId) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.supporting_contact_already_assigned.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.supporting_contact_already_assigned.notification.message`,
            {
              lang,
            },
          ),
        );
      } else {
        const relationships = await this.userRelationshipsRepository.find({
          where: {
            relations: In([ERelationshipToSenior.INFORMAL_CAREGIVER]),
          },
        });

        Object.assign(existingSupportingContact, {
          contact_type: EContactType.SUPPORTING,
          relation: [],
          user: { id: seniorId },
        });

        existingSupportingContact.relation.push(...relationships);
        await this.userContactRepository.save(existingSupportingContact);

        senior.admins.push(informalCaregiver);
        await this.userRepository.save(senior);

        return createResponse(
          HttpStatus.OK,
          null,
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.caregiver_assigned.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.caregiver_assigned.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    const relationships = await this.userRelationshipsRepository.find({
      where: {
        relations: In([ERelationshipToSenior.INFORMAL_CAREGIVER]),
      },
    });

    const supportingContact = new UserContact();
    Object.assign(supportingContact, {
      first_name: informalCaregiver.first_name,
      last_name: informalCaregiver.last_name,
      phone_number: informalCaregiver.phone_number,
      email_address: informalCaregiver.email_address,
      contact_type: EContactType.SUPPORTING,
      relation: [],
      user: { id: seniorId },
    });
    supportingContact.relation.push(...relationships);
    const savedUserContact = await this.userContactRepository.save(supportingContact);
    const foundAddress = await this.addressRepository.findOne({
      where: {
        admin: {
          id: informalCaregiver.id,
        },
      },
    });

    const newAddressToSave = {
      city: foundAddress?.city || '',
      street: foundAddress?.street || '',
      building: foundAddress?.building || '',
      flat: foundAddress?.flat || '',
      zip_code: foundAddress?.zip_code || '',
      additional_info: foundAddress?.additional_info || '',
      user_contact: savedUserContact,
    };
    const addressToSave = new Address();
    Object.assign(addressToSave, newAddressToSave);
    await this.addressRepository.save(addressToSave);

    senior.admins.push(informalCaregiver);
    await this.userRepository.save(senior);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.caregiver_assigned.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.ASSIGN_IC_AS_SUPPORTING_CONTACT_TO_SENIOR.caregiver_assigned.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async addEmergencyContact(
    caregiverId: number,
    { address, ...data }: AddFamilyDoctorDto | AddSupportingContactDto,
    seniorId: number,
    contactType: EContactType,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const email_address = data.email_address?.toLowerCase();

    const [isUserAssignedToAdmin, user] = await Promise.all([
      this.isUserAssignedToAdmin(caregiverId, seniorId),
      this.userRepository.findOne({
        where: { id: seniorId },
        relations: ['admins', 'admins.roles'],
      }),
    ]);

    if (!isUserAssignedToAdmin || !user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const [phoneConflict, emailConflict] = await Promise.all([
      this.userContactRepository.findOne({
        where: { user: { id: seniorId }, phone_number: data.phone_number },
      }),
      data.email_address
        ? this.userContactRepository.findOne({
            where: { user: { id: seniorId }, email_address: email_address },
          })
        : null,
    ]);

    if (phoneConflict || emailConflict) {
      const conflictMessages = [];
      if (phoneConflict) {
        conflictMessages.push('phone number');
      }
      if (emailConflict) {
        conflictMessages.push('email address');
      }

      const title =
        conflictMessages.length > 1
          ? this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.already_assigned.notification.title`,
              { lang },
            )
          : this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.already_assigned2.notification.title`,
              { lang },
            );

      const message =
        conflictMessages.length > 1
          ? this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.already_assigned.notification.message`,
              { lang, args: { conflictMessages: conflictMessages.join(' and ') } },
            )
          : this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.already_assigned2.notification.message`,
              { lang, args: { conflictMessages: conflictMessages[0] } },
            );

      return createResponse(HttpStatus.CONFLICT, null, title, message);
    }

    if ('relation' in data && data.relation.includes(ERelationshipToSenior.INFORMAL_CAREGIVER) && !data.email_address) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.email_required.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.email_required.notification.message`, {
          lang,
        }),
      );
    }

    if ('relation' in data && data.relation.includes(ERelationshipToSenior.INFORMAL_CAREGIVER)) {
      const userHasICAssigned = user.admins.some((admin) =>
        admin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
      );
      if (userHasICAssigned) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.ic_already_assigned.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.ic_already_assigned.notification.message`,
            {
              lang,
            },
          ),
        );
      }
      const carer = await this.adminRepository.findOne({
        where: [{ email_address: email_address }, { phone_number: data.phone_number }],
        relations: ['roles'],
      });

      if (carer) {
        const hasInformalCaregiverRole = carer.roles?.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER);

        if (!hasInformalCaregiverRole) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_cannot_be_added.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_cannot_be_added.notification.message`,
              {
                lang,
              },
            ),
          );
        }
        if (carer.email_address !== email_address || carer.phone_number !== data.phone_number) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_already_exists.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_already_exists.notification.message`,
              {
                lang,
              },
            ),
          );
        }
        await this.adminInstitutionService.assignInformalCaregiverToSenior(caregiverId, carer.id, seniorId);
      } else {
        const addInformalCaregiverData: AddInformalCaregiverDto = {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          email_address,
          address: address,
        };
        const newIC = await this.adminInstitutionService.addInformalCaregiver(addInformalCaregiverData, caregiverId);
        const newICId = newIC as unknown as { details: { id: number } };
        await this.adminInstitutionService.assignInformalCaregiverToSenior(caregiverId, newICId.details.id, seniorId);
      }
    }

    const supportingContact = new UserContact();
    Object.assign(supportingContact, {
      ...data,
      email_address,
      contact_type: contactType,
      user: { id: seniorId },
    });
    if ('relation' in data) {
      const relationships = await this.userRelationshipsRepository.find({
        where: {
          relations: In(data.relation),
        },
      });

      supportingContact.relation.push(...relationships);
    }
    await this.userContactRepository.save(supportingContact);

    if (address) {
      await this.assignAddress(address, supportingContact);
    }

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_added.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_added.notification.message`, {
        lang,
      }),
    );
  }

  async updateEmergencyContact(
    caregiverId: number,
    seniorId: number,
    contactId: number,
    { address, ...contactData }: AddFamilyDoctorDto | AddSupportingContactDto,
    contactType: EContactType,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const [isUserAssignedToAdmin, user, contactToUpdate] = await Promise.all([
      this.isUserAssignedToAdmin(caregiverId, seniorId),
      this.userRepository.findOne({
        where: { id: seniorId },
        relations: ['admins', 'admins.roles'],
      }),
      this.userContactRepository.findOne({
        where: {
          id: contactId,
          user: {
            id: seniorId,
            admins: {
              id: caregiverId,
            },
          },
          contact_type: contactType,
        },
      }),
    ]);

    if (!contactToUpdate || !isUserAssignedToAdmin || !user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_EMERGENCY_CONTACT.contact_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_EMERGENCY_CONTACT.contact_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    const userHasICAssigned = user.admins.some((admin) =>
      admin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
    );

    const currentUsersInformalCaregiver = user.admins.find((admin) =>
      admin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
    );

    const currentInformalCaregiverId = currentUsersInformalCaregiver ? currentUsersInformalCaregiver.id : null;

    const updatingToInformalCaregiver =
      'relation' in contactData && contactData.relation.includes(ERelationshipToSenior.INFORMAL_CAREGIVER);

    const informalCaregiverWhoIsSupportingContact = await this.adminRepository.findOne({
      where: {
        email_address: contactToUpdate.email_address,
      },
    });

    const supportContactIsICAssignedToSenior =
      currentInformalCaregiverId === informalCaregiverWhoIsSupportingContact?.id;

    if (updatingToInformalCaregiver && !contactData.email_address) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Email address is required for informal caregivers');
    }

    const phoneConflict = await this.userContactRepository.findOne({
      where: {
        user: { id: seniorId },
        phone_number: contactData.phone_number,
        id: Not(contactId),
      },
    });

    const emailConflict = contactData.email_address
      ? await this.userContactRepository.findOne({
          where: {
            user: { id: seniorId },
            email_address: contactData.email_address,
            id: Not(contactId),
          },
        })
      : null;

    if (phoneConflict || emailConflict) {
      const conflictMessages = [];
      if (phoneConflict) {
        conflictMessages.push('phone number');
      }
      if (emailConflict) {
        conflictMessages.push('email address');
      }

      const conflictMessage =
        conflictMessages.length > 1
          ? `Emergency contact with given ${conflictMessages.join(' and ')} are already assigned to this user`
          : `Emergency contact with given ${conflictMessages[0]} is already assigned to this user`;

      return createResponse(
        HttpStatus.CONFLICT,
        null,
        conflictMessage,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_FAMILY_DOCTOR.already_assigned.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_FAMILY_DOCTOR.already_assigned.notification.message`, {
          lang,
        }),
      );
    }

    if (userHasICAssigned && supportContactIsICAssignedToSenior && !updatingToInformalCaregiver) {
      await this.adminInstitutionService.revokeInformalCaregiverFromSenior(
        caregiverId,
        informalCaregiverWhoIsSupportingContact.id,
        seniorId,
      );
    }

    if (updatingToInformalCaregiver) {
      if (userHasICAssigned) {
        if (!supportContactIsICAssignedToSenior) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.ic_already_assigned.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.ic_already_assigned.notification.message`,
              {
                lang,
              },
            ),
          );
        }
        const addInformalCaregiverData: UpdateCaregiverContactDto = {
          phone_number: contactData.phone_number,
          email_address: contactData.email_address,
          address: address,
        };
        await this.adminInstitutionService.updateCaregiverContact(
          informalCaregiverWhoIsSupportingContact.id,
          caregiverId,
          ERole.INFORMAL_CAREGIVER,
          addInformalCaregiverData,
          true,
        );
        await this.adminInstitutionService.updateCaregiverInfo(
          informalCaregiverWhoIsSupportingContact.id,
          informalCaregiverWhoIsSupportingContact.id,
          ERole.INFORMAL_CAREGIVER,
          {
            first_name: contactData.first_name,
            last_name: contactData.last_name,
          },
        );
      }
      const carer = await this.adminRepository.findOne({
        where: [{ email_address: contactData.email_address }, { phone_number: contactData.phone_number }],
        relations: ['roles'],
      });
      if (carer) {
        const hasInformalCaregiverRole = carer.roles?.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER);

        if (!hasInformalCaregiverRole) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_cannot_be_added.notification.title`,
              {
                lang,
              },
            ),
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_cannot_be_added.notification.message`,
              {
                lang,
              },
            ),
          );
        }
        if (carer.email_address !== contactData.email_address || carer.phone_number !== contactData.phone_number) {
          createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.ADD_EMERGENCY_CONTACT.contact_already_exists.notification.title`,
              { lang },
            ),
          );
        }
        await this.adminInstitutionService.assignInformalCaregiverToSenior(caregiverId, carer.id, seniorId);
      } else {
        const addInformalCaregiverData: AddInformalCaregiverDto = {
          first_name: contactData.first_name,
          last_name: contactData.last_name,
          phone_number: contactData.phone_number,
          email_address: contactData.email_address,
          address: address,
        };
        const newIC = await this.adminInstitutionService.addInformalCaregiver(addInformalCaregiverData, caregiverId);
        const newICId = newIC as unknown as { details: { id: number } };
        await this.adminInstitutionService.assignInformalCaregiverToSenior(caregiverId, newICId.details.id, seniorId);
      }
    }

    Object.assign(contactToUpdate, contactData);
    if ('relation' in contactData) {
      const relationships = await this.userRelationshipsRepository.find({
        where: {
          relations: In(contactData.relation),
        },
      });

      contactToUpdate.relation.push(...relationships);
    }
    await this.userContactRepository.save(contactToUpdate);

    if (address) {
      const existingAddress = await this.addressRepository.findOne({
        where: {
          user_contact: {
            id: contactId,
          },
        },
      });

      const addressEntity = existingAddress || new Address();
      Object.assign(addressEntity, address);
      addressEntity.user_contact = contactToUpdate;

      await this.addressRepository.save(addressEntity);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_EMERGENCY_CONTACT.contact_updated.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.UPDATE_EMERGENCY_CONTACT.contact_updated.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getEmergencyContacts(
    userId: number,
    seniorId: number,
    contact_type: EContactType,
  ): Promise<TResponse<TContactWithAddress[]>> {
    const lang = I18nContext.current().lang;

    const isUserAssignedToAdmin = await this.isUserAssignedToAdmin(userId, seniorId);

    if (!isUserAssignedToAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const emergencyContacts = await this.userContactRepository.find({
      where: {
        user: { id: seniorId },
        contact_type,
      },
      relations: contact_type === EContactType.SUPPORTING ? ['relation'] : null,
    });

    const emergencyContactsAndAddresses = await Promise.all(
      emergencyContacts.map(async (contact) => {
        const address = await this.addressRepository.findOne({
          where: { user_contact: { id: contact.id } },
        });
        return { contact, address };
      }),
    );

    return createResponse(
      HttpStatus.OK,
      emergencyContactsAndAddresses,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_EMERGENCY_CONTACT.contact_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_EMERGENCY_CONTACT.contact_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getPersonalDetails(userId: number, seniorId: number): Promise<TResponse<PersonalDetails>> {
    const lang = I18nContext.current().lang;
    const isUserAssignedToAdmin = await this.isUserAssignedToAdmin(userId, seniorId);

    if (!isUserAssignedToAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const [basicInfo, supportingContacts, familyDoctor, userImage] = await Promise.all([
      await this.getUserInfo(seniorId, userId).then((ui) => ui.details),
      await this.getEmergencyContacts(userId, seniorId, EContactType.SUPPORTING).then((ec) => ec.details),
      await this.getEmergencyContacts(userId, seniorId, EContactType.DOCTOR).then((fd) => fd.details),
      await this.adminInstitutionService.getImage(seniorId, User).then((i) => i.details),
    ]);

    const personalDetails = {
      basicInfo,
      supportingContacts,
      familyDoctor,
      userImage,
    };

    return createResponse(
      HttpStatus.OK,
      personalDetails,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_PERSONAL_DETAILS.details_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_PERSONAL_DETAILS.details_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async deleteSupportingContact(
    userId: number,
    seniorId: number,
    contactId: number,
    contact_type: EContactType,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const contactToDelete = await this.userContactRepository.findOne({
      where: {
        id: contactId,
        user: {
          id: seniorId,
          admins: {
            id: userId,
          },
        },
        contact_type,
      },
      relations: ['relation'],
    });
    const isInformalCaregiver = contactToDelete?.relation?.some(
      (rel) => rel.relations === ERelationshipToSenior.INFORMAL_CAREGIVER,
    );

    if (!contactToDelete) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_EMERGENCY_CONTACT.contact_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_EMERGENCY_CONTACT.contact_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    if (isInformalCaregiver) {
      const informalCaregiver = await this.adminRepository.findOne({
        where: {
          email_address: contactToDelete.email_address,
        },
      });

      await this.adminInstitutionService.revokeInformalCaregiverFromSenior(userId, informalCaregiver.id, seniorId);
    }

    await this.userContactRepository.remove(contactToDelete);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.DELETE_EMERGENCY_CONTACT.contact_deleted.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.DELETE_EMERGENCY_CONTACT.contact_deleted.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async addAdditionalInfo(
    userId: number,
    seniorId: number,
    assessmentId: number,
    uploadedFiles?: FileArray,
    notes?: { notes?: string },
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: userId,
        },
      },
      relations: ['admins'],
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const { bucketNameDocuments, region } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    const buckets = await s3Client.listBuckets();
    const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameDocuments);

    if (!bucketExists) {
      try {
        await s3Client.createBucket({
          Bucket: bucketNameDocuments,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      } catch (error) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_create.notification.title`, {
            lang,
          }),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_create.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }
    try {
      const additionalInfo = new UserAdditionalInfo();
      Object.assign(additionalInfo, {
        user,
        notes: notes?.notes || null,
      });

      const assessment = await this.userAssessmentRepository.findOne({
        where: { id: assessmentId },
      });

      if (!assessment) {
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.assessment_not_found.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.assessment_not_found.notification.message`,
            {
              lang,
            },
          ),
        );
      }
      additionalInfo.assessment = assessment;

      await this.userAdditionalInfoRepository.save(additionalInfo);

      if (uploadedFiles && Array.isArray(uploadedFiles.files) && uploadedFiles.files.length > 0) {
        await Promise.all(
          uploadedFiles.files.map(async (file) => {
            const { originalname, buffer } = file;
            const uniqueName = `${uuidv4()}.${originalname.split('.').pop()}`;
            await s3Client.putObject({
              Bucket: bucketNameDocuments,
              Key: uniqueName,
              Body: buffer,
            });
            const attachments = new Attachment();
            Object.assign(attachments, {
              name: originalname,
              unique_name: uniqueName,
              user_additional_info: additionalInfo,
            });

            await this.attachmentRepository.save(attachments);
          }),
        );
      }
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_upload.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_upload.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.info_added.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.info_added.notification.message`, {
        lang,
      }),
    );
  }

  private calculateQualityOfLifeScore({
    mobility,
    self_care,
    usual_activities,
    pain_discomfort,
    anxiety_depression,
  }: AddQualityOfLifeDto): number {
    const problemLevelScores = {
      [EProblemsLevel.NONE]: 1,
      [EProblemsLevel.SLIGHT]: 2,
      [EProblemsLevel.MODERATE]: 3,
      [EProblemsLevel.SEVERE]: 4,
      [EProblemsLevel.EXTREME]: 5,
    };

    const qualityOfLifeScore = [
      problemLevelScores[mobility],
      problemLevelScores[self_care],
      problemLevelScores[usual_activities],
      problemLevelScores[pain_discomfort],
      problemLevelScores[anxiety_depression],
    ].join('');

    return parseInt(qualityOfLifeScore);
  }

  async addUserAssessment(
    userId: number,
    seniorId: number,
    {
      cognitive_abilities,
      physical_activities,
      social_abilities,
      quality_of_life,
      sleep_assessment,
    }: AddUserAssessmentDto,
  ): Promise<TResponse<{ userAssessmentId: number }>> {
    const lang = I18nContext.current().lang;
    if (cognitive_abilities.moca_scoring < 18) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.moca_too_low.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.moca_too_low.notification.message`, {
          lang,
        }),
      );
    }

    const isUserAssignedToAdmin = await this.isUserAssignedToAdmin(userId, seniorId);
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
      },
      relations: ['assessments', 'userActivities'],
    });

    if (!isUserAssignedToAdmin || !user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const { currently_bedridden, can_walk_without_support, severe_balance_problems, ...otherActivities } =
      physical_activities;

    const hasOtherPhysicalActivity = otherActivities && Object.values(otherActivities).some(Boolean);

    if ((currently_bedridden || !can_walk_without_support || severe_balance_problems) && hasOtherPhysicalActivity) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.user_bedridden.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.user_bedridden.notification.message`, {
          lang,
        }),
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newCognitiveAbilities = new UserCognitiveAbilities();
      Object.assign(newCognitiveAbilities, { moca_scoring: cognitive_abilities.moca_scoring, user });

      const newPhysicalActivities = new UserPhysicalActivities();
      Object.assign(newPhysicalActivities, { ...physical_activities, user });

      const newSocialAbilities = new UserSocialAbilities();
      Object.assign(newSocialAbilities, { ...social_abilities, user });

      const newQualityOfLife = new UserQualityOfLife();
      Object.assign(newQualityOfLife, { ...quality_of_life, user });

      const newSleepAssessment = new UserSleepAssessment();
      Object.assign(newSleepAssessment, { ...sleep_assessment, user });

      await Promise.all([
        queryRunner.manager.save(newCognitiveAbilities),
        queryRunner.manager.save(newPhysicalActivities),
        queryRunner.manager.save(newSocialAbilities),
        queryRunner.manager.save(newQualityOfLife),
        queryRunner.manager.save(newSleepAssessment),
      ]);

      const userAssessment = new UserAssessment();
      Object.assign(userAssessment, {
        user_cognitive_abilities: newCognitiveAbilities,
        user_physical_activities: newPhysicalActivities,
        user_social_abilities: newSocialAbilities,
        user_quality_of_life: newQualityOfLife,
        user_sleep_assessment: newSleepAssessment,
      });

      await queryRunner.manager.save(userAssessment);
      user.assessments.push(userAssessment);
      await queryRunner.manager.save(user);

      const userAssessmentScores = new UserConditionAssessmentScores();
      Object.assign(userAssessmentScores, {
        cognitive_abilities_group: this.calculateCognitiveAbilitiesScore(cognitive_abilities),
        physical_activities_group: this.calculatePhysicalActivitiesScore(physical_activities).activity_group,
        physical_activities_tier: this.calculatePhysicalActivitiesScore(physical_activities).activity_level,
        social_abilities: this.calculateSocialAbilitiesScore(social_abilities).social_abilities,
        social_loneliness: this.calculateSocialAbilitiesScore(social_abilities).social_loneliness,
        emotional_loneliness: this.calculateSocialAbilitiesScore(social_abilities).emotional_loneliness,
        quality_of_life: this.calculateQualityOfLifeScore(quality_of_life),
        sleep_assessment: this.calculateSleepAssessmentScore(sleep_assessment),
        user_assessment: userAssessment,
      });

      await queryRunner.manager.save(userAssessmentScores);

      await queryRunner.commitTransaction();

      if (user.userActivities) {
        await queryRunner.manager.delete(UserActivities, { user: { id: seniorId } });
      }

      return createResponse(
        HttpStatus.CREATED,
        { userAssessmentId: userAssessment.id },
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.assessment_added.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.assessment_added.notification.message`, {
          lang,
        }),
      );
    } catch (error) {
      this.loggerService.log(error);
      await queryRunner.rollbackTransaction();
      return createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.assessment_failed.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.ADD_USER_ASSESSMENT.assessment_failed.notification.message`,
          {
            lang,
          },
        ),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getSeniorFormSteps(seniorId: number, formType: ESeniorFormType): Promise<TResponse<Onboarding>> {
    const lang = I18nContext.current().lang;
    const stepColumns = ['step1', 'step2', 'step3', 'step4'];

    const seniorAddForm = await this.onboardingRepository
      .createQueryBuilder('onboarding')
      .select(stepColumns.map((step) => `onboarding.${step}`))
      .innerJoin('onboarding.user', 'user')
      .andWhere('user.id = :seniorId', { seniorId })
      .andWhere('onboarding.form_type = :formType', { formType })
      .getOne();

    if (!seniorAddForm) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_SENIOR_FORM_STEPS.user_form_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_SENIOR_FORM_STEPS.user_form_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      seniorAddForm,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SENIOR_FORM_STEPS.user_form_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.GET_SENIOR_FORM_STEPS.user_form_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async updateAddSeniorFormSteps(step: number, seniorId: number, form_type: ESeniorFormType): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const addSeniorForm = await this.onboardingRepository.findOne({
      where: {
        form_type,
        user: {
          id: seniorId,
        },
      },
    });

    if (!addSeniorForm) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.form_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.form_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const stepProperties = this.adminInstitutionService.getStepProperties(addSeniorForm);
    const maxStep = stepProperties.length;

    if (step < 1 || step > maxStep) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.invalid_step_value.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.invalid_step_value.notification.message`,
          {
            lang,
            args: { property: maxStep },
          },
        ),
      );
    }

    const stepPropertyName = `step${step}`;

    if (addSeniorForm[stepPropertyName]) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.already_completed.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.already_completed.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.adminInstitutionService.updateStep(addSeniorForm, step);

    const allStepsCompleted = stepProperties.every((stepKey) => addSeniorForm[stepKey]);

    if (allStepsCompleted) {
      await this.onboardingRepository.delete(addSeniorForm.id);

      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.forms_completed.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.forms_completed.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.form_step_updated.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.UPDATE_ADD_SENIOR_FORM_STEPS.form_step_updated.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async updateBasicInformation(
    updateUserDto: UpdateBasicInformationDto,
    caregiverId: number,
    userId: number,
  ): Promise<TResponse | TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const { phone_number, email_address, first_name, last_name, date_of_birth } = updateUserDto;

    const userInfo = await this.updateUserInfo({ first_name, last_name, date_of_birth }, caregiverId, userId);
    const contactInfo = await this.updateContactToUser({ phone_number, email_address }, caregiverId, userId);

    if (userInfo.status !== HttpStatus.OK) {
      await this.userRepository.save(user);
      return userInfo;
    }

    if (contactInfo.status !== HttpStatus.OK) {
      await this.userRepository.save(user);
      return contactInfo;
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_USER_INFO.data_updated.notification.title`, { lang }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.UPDATE_USER_INFO.data_updated.notification.message`, { lang }),
    );
  }

  private calculateCognitiveAbilitiesScore(cognitive_abilities: AddCognitiveAbilitiesDto): string {
    let assessment;

    if (cognitive_abilities.moca_scoring > 26) {
      assessment = EUserCognitiveAbilitiesGroup.NORMAL;
    } else if (cognitive_abilities.moca_scoring >= 23) {
      assessment = EUserCognitiveAbilitiesGroup.VERY_MILD_COGNITIVE_IMPAIRMENT;
    } else if (cognitive_abilities.moca_scoring >= 18) {
      assessment = EUserCognitiveAbilitiesGroup.MODERATE_COGNITIVE_IMPAIRMENT;
    }
    return assessment;
  }

  private calculateSocialAbilitiesScore(userSocialAbilities: AddSocialAbilitiesDto): TSocialAbilityScores {
    let EL_points = 0;
    let SL_points = 0;

    const EL_scoringRules: Partial<{ [key in keyof AddSocialAbilitiesDto]: ESocialAbilitiesResponseType[] }> = {
      experience_of_emptiness: [ESocialAbilitiesResponseType.YES, ESocialAbilitiesResponseType.MORE_OR_LESS],
      miss_having_people_around: [ESocialAbilitiesResponseType.YES, ESocialAbilitiesResponseType.MORE_OR_LESS],
      feel_rejected: [ESocialAbilitiesResponseType.YES, ESocialAbilitiesResponseType.MORE_OR_LESS],
    };

    const SL_scoringRules: Partial<{ [key in keyof AddSocialAbilitiesDto]: ESocialAbilitiesResponseType[] }> = {
      rely_on_people: [ESocialAbilitiesResponseType.MORE_OR_LESS, ESocialAbilitiesResponseType.NO],
      trust_completely: [ESocialAbilitiesResponseType.MORE_OR_LESS, ESocialAbilitiesResponseType.NO],
      enough_people_feel_close: [ESocialAbilitiesResponseType.MORE_OR_LESS, ESocialAbilitiesResponseType.NO],
    };

    for (const key in userSocialAbilities) {
      if (EL_scoringRules.hasOwnProperty(key)) {
        const response = userSocialAbilities[key as keyof AddSocialAbilitiesDto];
        if (EL_scoringRules[key as keyof AddSocialAbilitiesDto].includes(response)) {
          EL_points += 1;
        }
      }

      if (SL_scoringRules.hasOwnProperty(key)) {
        const response = userSocialAbilities[key as keyof AddSocialAbilitiesDto];
        if (SL_scoringRules[key as keyof AddSocialAbilitiesDto].includes(response)) {
          SL_points += 1;
        }
      }
    }

    return { social_loneliness: SL_points, emotional_loneliness: EL_points, social_abilities: SL_points + EL_points };
  }

  async getUserAssessmentScores(
    caregiverId: number,
    seniorId: number,
    area?: EUserAssessmentAreas,
  ): Promise<TResponse<Partial<UserConditionAssessmentScores>>> {
    const lang = I18nContext.current().lang;
    const userAssessmentsScores = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: {
            id: seniorId,
            admins: { id: caregiverId },
          },
        },
      },
      order: { created_at: 'DESC' },
    });
    if (!userAssessmentsScores) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_USER_ASSESSMENT_SCORES.scores_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_USER_ASSESSMENT_SCORES.scores_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    let responseData: Partial<UserConditionAssessmentScores> = userAssessmentsScores;

    if (area && userAssessmentsScores.hasOwnProperty(area)) {
      responseData = { [area]: userAssessmentsScores[area as keyof UserConditionAssessmentScores] };
    }

    return createResponse(
      HttpStatus.OK,
      responseData,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_USER_ASSESSMENT_SCORES.score_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.GET_USER_ASSESSMENT_SCORES.score_fetched.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getMobilityLevel(caregiverId: number, seniorId: number): Promise<TResponse<GetUserMobilityLevel>> {
    const lang = I18nContext.current().lang;

    const userConditionAssessmentScores = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          users: {
            id: seniorId,
            admins: { id: caregiverId },
          },
        },
      },
      order: { created_at: 'DESC' },
    });

    if (!userConditionAssessmentScores) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MOBILITY_LEVEL.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MOBILITY_LEVEL.not_found.notification.message`, {
          lang,
        }),
      );
    }
    const mobility_level = userConditionAssessmentScores.physical_activities_group;
    const recommended_level = userConditionAssessmentScores.physical_activities_tier;

    return createResponse(
      HttpStatus.OK,
      { mobility_level, recommended_level },
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MOBILITY_LEVEL.level_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_MOBILITY_LEVEL.level_fetched.notification.message`, {
        lang,
      }),
    );
  }

  private calculateSleepAssessmentScore(sleep_assessment: AddSleepAssessmentDto): number {
    let component1 = 0,
      component2 = 0,
      component2sub = 0,
      component3 = 0,
      component4 = 0,
      component5 = 0,
      component5sub = 0,
      component6 = 0,
      component7 = 0,
      component7sub = 0,
      totalScore = 0;

    const {
      bed_time,
      wake_up_time,
      sleep_quality_rating,
      fall_asleep_duration,
      cannot_sleep_within_30_minutes,
      actual_sleep_hours,
      wake_up_midnight_or_early_morning,
      need_to_use_bathroom,
      cannot_breathe_comfortably,
      cough_or_snore_loudly,
      feel_too_cold,
      feel_too_hot,
      had_bad_dreams,
      have_pain,
      sleeping_trouble_frequency,
      medicine_for_sleep,
      trouble_staying_awake_frequency,
      enthusiasm_to_get_things_done,
    } = sleep_assessment;

    const sleepQualityMap: { [key in ESleepQuality]: number } = {
      [ESleepQuality.VERY_GOOD]: 0,
      [ESleepQuality.FAIRLY_GOOD]: 1,
      [ESleepQuality.FAIRLY_BAD]: 2,
      [ESleepQuality.VERY_BAD]: 3,
    };

    const frequencyPointsMap: { [key in EFrequency]: number } = {
      [EFrequency.NOT_PAST_MONTH]: 0,
      [EFrequency.LESS_THAN_ONCE]: 1,
      [EFrequency.ONCE_OR_TWICE]: 2,
      [EFrequency.THREE_OR_MORE_TIMES]: 3,
    };

    const enthusiasmLevelMap: { [key in EEnthusiasmLevel]: number } = {
      [EEnthusiasmLevel.NO_PROBLEM]: 0,
      [EEnthusiasmLevel.VERY_SLIGHT_PROBLEM]: 1,
      [EEnthusiasmLevel.SOMEWHAT_A_PROBLEM]: 2,
      [EEnthusiasmLevel.A_VERY_BIG_PROBLEM]: 3,
    };

    component1 += sleepQualityMap[sleep_quality_rating];

    if (fall_asleep_duration <= 15) {
      component2sub += 0;
    } else if (fall_asleep_duration >= 16 && fall_asleep_duration <= 30) {
      component2sub += 1;
    } else if (fall_asleep_duration >= 31 && fall_asleep_duration <= 60) {
      component2sub += 2;
    } else if (fall_asleep_duration > 60) {
      component2sub += 3;
    }

    component2sub += frequencyPointsMap[cannot_sleep_within_30_minutes];

    if (component2sub === 0) {
      component2 = 0;
    } else if (component2sub === 1 || component2sub === 2) {
      component2 = 1;
    } else if (component2sub === 3 || component2sub === 4) {
      component2 = 2;
    } else if (component2sub === 5 || component2sub === 6) {
      component2 = 3;
    }

    if (actual_sleep_hours > 7) {
      component3 = 0;
    } else if (actual_sleep_hours > 6) {
      component3 = 1;
    } else if (actual_sleep_hours > 5) {
      component3 = 2;
    } else {
      component3 = 3;
    }

    const hoursInBed = this.calculateHoursInBed(bed_time, wake_up_time);
    const sleepEfficiency = (actual_sleep_hours / hoursInBed) * 100;

    if (sleepEfficiency > 85) {
      component4 = 0;
    } else if (sleepEfficiency >= 75) {
      component4 = 1;
    } else if (sleepEfficiency >= 65) {
      component4 = 2;
    } else {
      component4 = 3;
    }

    component5sub += frequencyPointsMap[wake_up_midnight_or_early_morning];
    component5sub += frequencyPointsMap[need_to_use_bathroom];
    component5sub += frequencyPointsMap[cannot_breathe_comfortably];
    component5sub += frequencyPointsMap[cough_or_snore_loudly];
    component5sub += frequencyPointsMap[feel_too_cold];
    component5sub += frequencyPointsMap[feel_too_hot];
    component5sub += frequencyPointsMap[had_bad_dreams];
    component5sub += frequencyPointsMap[have_pain];
    component5sub += frequencyPointsMap[sleeping_trouble_frequency];

    if (component5sub === 0) {
      component5 = 0;
    } else if (component5sub >= 1 && component5sub <= 9) {
      component5 = 1;
    } else if (component5sub >= 10 && component5sub <= 18) {
      component5 = 2;
    } else if (component5sub >= 19 && component5sub <= 27) {
      component5 = 3;
    }

    component6 += frequencyPointsMap[medicine_for_sleep];

    component7sub += frequencyPointsMap[trouble_staying_awake_frequency];
    component7sub += enthusiasmLevelMap[enthusiasm_to_get_things_done];

    if (component7sub === 0) {
      component7 = 0;
    } else if (component7sub === 1 || component7sub === 2) {
      component7 = 1;
    } else if (component7sub === 3 || component7sub === 4) {
      component7 = 2;
    } else if (component7sub === 5 || component7sub === 6) {
      component7 = 3;
    }

    totalScore = component1 + component2 + component3 + component4 + component5 + component6 + component7;

    return totalScore;
  }

  private calculatePhysicalActivitiesScore(physical_activities: AddPhysicalActivitiesDto): {
    activity_group: EUserPhysicalActivityGroup;
    activity_level?: EActivityLevel;
  } {
    let activity_group: EUserPhysicalActivityGroup;
    const {
      currently_bedridden,
      can_walk_without_support,
      severe_balance_problems,
      vigorous_activity_days_last_week,
      vigorous_activity_minutes_per_day,
      moderate_activity_days_last_week,
      moderate_activity_minutes_per_day,
      walking_days_last_week,
      walking_minutes_per_day,
    } = physical_activities;

    const MET_VALUES = {
      vigorous: 8.0,
      moderate: 4.0,
      walking: 3.3,
    };
    if (currently_bedridden) {
      return { activity_group: EUserPhysicalActivityGroup.BEDRIDDEN_ACTIVITIES };
    }

    if (!can_walk_without_support || severe_balance_problems) {
      return { activity_group: EUserPhysicalActivityGroup.MOBILITY_LIMITATION_ACTIVITIES };
    } else {
      activity_group = EUserPhysicalActivityGroup.WITHOUT_LIMITATION_ACTIVITIES;
    }

    const calculateMETMinutes = (days: number | null, minutes: number | null, met: number): number => {
      const validDays = days ?? 0;
      let validMinutes = minutes ?? 0;

      if (validMinutes < 10) {
        return 0;
      } else if (validMinutes > 180) {
        validMinutes = 180;
      }
      return validDays * validMinutes * met;
    };

    const vigorous_activity_MET_minutes_weekly = calculateMETMinutes(
      vigorous_activity_days_last_week,
      vigorous_activity_minutes_per_day,
      MET_VALUES.vigorous,
    );
    const moderate_activity_MET_minutes_weekly = calculateMETMinutes(
      moderate_activity_days_last_week,
      moderate_activity_minutes_per_day,
      MET_VALUES.moderate,
    );
    const walking_MET_minutes_weekly = calculateMETMinutes(
      walking_days_last_week,
      walking_minutes_per_day,
      MET_VALUES.walking,
    );

    const total_MET_minutes_weekly =
      vigorous_activity_MET_minutes_weekly + moderate_activity_MET_minutes_weekly + walking_MET_minutes_weekly;

    let activity_level: EActivityLevel | null;
    if (total_MET_minutes_weekly < 600) {
      activity_level = EActivityLevel.LIGHT;
    } else if (total_MET_minutes_weekly < 3000) {
      activity_level = EActivityLevel.MODERATE;
    } else if (total_MET_minutes_weekly >= 3000) {
      activity_level = EActivityLevel.INTENSE;
    }

    return { activity_level, activity_group };
  }

  async uploadSeniorDocuments(
    caregiverId: number,
    seniorId: number,
    uploadedFiles: SeniorDocumentsFilesArray,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
      },
      relations: ['admins', 'admins.roles'],
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const { bucketNameDocuments, region } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    const buckets = await s3Client.listBuckets();
    const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameDocuments);

    if (!bucketExists) {
      try {
        await s3Client.createBucket({
          Bucket: bucketNameDocuments,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      } catch (error) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_create.notification.title`, {
            lang,
          }),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_create.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    try {
      let document = await this.userDocumentsRepository.findOne({
        where: {
          user: {
            id: seniorId,
          },
        },
      });

      if (!document) {
        document = new UserDocuments();
        document.user = user;
        await this.userDocumentsRepository.save(document);
      }

      if (uploadedFiles && Array.isArray(uploadedFiles.files) && uploadedFiles.files.length > 0) {
        await Promise.all(
          uploadedFiles.files.map(async (file) => {
            const { originalname, buffer } = file;
            const uniqueName = `${uuidv4()}.${originalname.split('.').pop()}`;
            await s3Client.putObject({
              Bucket: bucketNameDocuments,
              Key: uniqueName,
              Body: buffer,
            });
            const attachments = new Attachment();
            Object.assign(attachments, {
              name: originalname,
              unique_name: uniqueName,
              user_documents: document,
              added_by: caregiverId,
            });

            await this.attachmentRepository.save(attachments);
          }),
        );
      }
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_upload.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.ADD_ADDITIONAL_INFO.failed_to_upload.notification.message`, {
          lang,
        }),
      );
    }

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Documents`;

    const adminsToSend = user?.admins?.filter(
      (admin) => admin.id !== caregiverId && admin.roles.some((role) => role.role_name !== ERole.INFORMAL_CAREGIVER),
    );

    if (!!adminsToSend.length) {
      await this.notificationService.sendNotification(
        seniorId,
        ENotificationTitle.NEW_DOCUMENT_UPLOADED,
        ENotificationPriority.HIGH,
        adminsToSend,
        user.first_name + ' ' + user.last_name,
        link,
      );
    }

    return createResponse(HttpStatus.OK, null, 'Documents successfully uploaded');
  }

  async getSeniorDocument(
    caregiverId: number,
    seniorId: number,
    documentId: number,
  ): Promise<Promise<TResponse> | Promise<TResponse<{ buffer: Buffer; filename: string }>>> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const attachment = await this.attachmentRepository.findOne({
      where: {
        id: documentId,
        user_documents: {
          user: {
            id: seniorId,
          },
        },
      },
      relations: ['user_documents'],
    });

    if (!attachment) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.document_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.document_not_found.notification.message`,
          { lang },
        ),
      );
    }

    async function streamToBuffer(readableStream: stream.Readable): Promise<Buffer> {
      const chunks: Uint8Array[] = [];
      for await (const chunk of readableStream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    }

    try {
      const { bucketNameDocuments } = this.configService.get('minio');
      const s3Client = this.minioClientService.getClient();

      const data = await s3Client.getObject({ Bucket: bucketNameDocuments, Key: attachment.unique_name });
      const objectStream = data.Body as stream.Readable;
      const buffer = await streamToBuffer(objectStream);

      return createResponse(
        HttpStatus.OK,
        { buffer, filename: attachment.name },
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.document_deleted.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.document_deleted.notification.message`, {
          lang,
        }),
      );
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.failed_to_get_document.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.failed_to_get_document.notification.message`,
          {
            lang,
          },
        ),
      );
    }
  }

  async deleteSeniorDocument(caregiverId: number, seniorId: number, documentId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }
    const attachment = await this.attachmentRepository.findOne({
      where: {
        id: documentId,
        user_documents: {
          user: {
            id: seniorId,
          },
        },
        added_by: {
          id: caregiverId,
        },
      },
      relations: ['user_documents'],
    });

    if (!attachment) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.document_not_found.notification.title`,
          { lang },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.document_not_found.notification.message`,
          { lang },
        ),
      );
    }
    try {
      const { bucketNameDocuments } = this.configService.get('minio');
      const s3Client = this.minioClientService.getClient();
      s3Client.deleteObject({ Bucket: bucketNameDocuments, Key: attachment.unique_name });
      await this.attachmentRepository.remove(attachment);
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.failed_to_delete_document.notification.title`,
          { lang },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.failed_to_delete_document.notification.message`,
          { lang },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.document_deleted.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.DELETE_SENIOR_DOCUMENT.document_deleted.notification.message`,
        { lang },
      ),
    );
  }

  async viewDocuments(caregiverId: number, seniorId: number): Promise<TResponse<TGetDocuments[]>> {
    const lang = I18nContext.current().lang;
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
      relations: ['user_documents', 'user_documents.documents'],
    });

    if (!user?.user_documents || !user?.user_documents?.documents?.length) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.VIEW_DOCUMENTS.documents_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminCaregiverResponseKey}.service.VIEW_DOCUMENTS.documents_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const { bucketNameDocuments } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();

    const documentNames = user.user_documents.documents.map((doc) => ({
      name: doc.name,
      unique_name: doc.unique_name,
    }));

    const documents = await Promise.all(
      documentNames.map(async (documentName) => {
        try {
          const result = await s3Client.getObject({
            Bucket: bucketNameDocuments,
            Key: documentName.unique_name,
          });

          const stream = result.Body as Readable;

          const buffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', (err) => reject(err));
          });

          const base64String = buffer.toString('base64');

          return {
            name: documentName.name,
            data: base64String,
          };
        } catch (error) {
          this.loggerService.log(error);
          return {
            name: documentName.name,
            data: null,
            error: this.i18n.t(
              `${TAdminCaregiverResponseKey}.service.VIEW_DOCUMENTS.error_fetching_document.notification.message`,
              {
                lang,
              },
            ),
          };
        }
      }),
    );

    return createResponse(
      HttpStatus.OK,
      documents,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.VIEW_DOCUMENTS.documents_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.VIEW_DOCUMENTS.documents_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getDocuments(
    caregiverId: number,
    seniorId: number,
    filterDto: GetDocumentsFilterDto,
  ): Promise<TResponse<TArrayResponse<Attachment>>> {
    const lang = I18nContext.current().lang;

    const queryBuilder = this.attachmentRepository
      .createQueryBuilder('documents')
      .leftJoinAndSelect('documents.added_by', 'added_by')
      .innerJoin('documents.user_documents', 'user_documents')
      .innerJoin('user_documents.user', 'user')
      .innerJoin('user.admins', 'admins')
      .where('user.id = :seniorId', { seniorId })
      .andWhere('admins.id = :caregiverId', { caregiverId })
      .orderBy('documents.created_at', 'DESC');

    const searchFields = ['documents.name'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();
    const documents = await filteredQueryBuilder.getMany();
    const response = createResponseDetails(documents, filterDto, total);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_DOCUMENTS.documents_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_DOCUMENTS.documents_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async checkIfInformalCaregiverExists(
    userId: number,
    { phone_number }: CheckIfInformalCaregiverExistsDto,
  ): Promise<TResponse<null | GetInformalCaregiverExists>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const informalCaregiver = await this.adminRepository.findOne({
      where: {
        phone_number,
        roles: {
          role_name: ERole.INFORMAL_CAREGIVER,
        },
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
    });

    let response: GetInformalCaregiverExists | null = null;

    if (informalCaregiver) {
      const { id, first_name, last_name, email_address } = informalCaregiver;
      response = {
        id,
        first_name,
        last_name,
        phone_number,
        email_address,
      };
    }

    const exists = !!informalCaregiver;
    const basePath = `${TAdminCaregiverResponseKey}.service.CHECK_IF_INFORMAL_CAREGIVERS_EXISTS`;
    const status = exists ? 'informal_caregiver_found' : 'informal_caregiver_not_found';
    const title = this.i18n.t(`${basePath}.${status}.notification.title`, { lang });
    const message = this.i18n.t(`${basePath}.${status}.notification.message`, { lang });

    return createResponse(HttpStatus.OK, response, title, message);
  }

  async sendLandingPageLinkViaEmail(caregiverId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    if (!user.email_address) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.SEND_LANDING_PAGE_LINK_VIA_EMAIL.no_email_address.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.SEND_LANDING_PAGE_LINK_VIA_EMAIL.no_email_address.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.emailService.sendLandingPageLinkEmail(user.email_address);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.SEND_LANDING_PAGE_LINK_VIA_EMAIL.email_sent.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.SEND_LANDING_PAGE_LINK_VIA_EMAIL.email_sent.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async getSecurityCode(caregiverId: number, seniorId: number): Promise<TResponse<TSecurityCode>> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const securityCode = await this.redisService.getItemFromRedis(user.id, 'pinCode');

    return createResponse(
      HttpStatus.OK,
      { security_code: securityCode },
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SECURITY_CODE.code_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.GET_SECURITY_CODE.code_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getUserAssessmentReport(
    caregiverId: number,
    seniorId: number,
    assessmentId: number,
  ): Promise<TResponse<Buffer>> {
    const lang = I18nContext.current().lang;
    const isUserAssignedToAdmin = await this.isUserAssignedToAdmin(caregiverId, seniorId);

    if (!isUserAssignedToAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    const assessment = await this.userAssessmentRepository.findOne({
      where: { id: assessmentId, users: { id: seniorId } },
      relations: [
        'user_cognitive_abilities',
        'user_physical_activities',
        'user_social_abilities',
        'user_quality_of_life',
        'user_sleep_assessment',
        'users',
        'users.admins',
        'users.admins.roles',
        'user_additional_info',
      ],
    });

    if (!assessment) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Assessment not found');
    }

    const formalCaregivers = assessment.users.admins.filter((admin) =>
      admin.roles.some((r) => r.role_name === ERole.FORMAL_CAREGIVER),
    );

    const conditionAssessmentScores = await this.userConditionAssessmentScoresRepository.findOne({
      where: {
        user_assessment: {
          id: assessment.id,
        },
      },
    });

    if (!conditionAssessmentScores) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Assessment scores not found');
    }

    const templatePath = path.join(__dirname, '../../', 'assets', 'assessment.docx');
    let buffer: Buffer;
    try {
      buffer = fs.readFileSync(templatePath);
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(HttpStatus.NOT_FOUND, null, 'Template file not found');
    }

    const zip = new PizZip(buffer);
    const doc = new Docxtemplater(zip, {
      delimiters: {
        start: '{{',
        end: '}}',
      },
      nullGetter: (): string => {
        return '-';
      },
      paragraphLoop: true,
      linebreaks: true,
    });

    const {
      user_physical_activities,
      user_cognitive_abilities,
      user_social_abilities,
      user_quality_of_life,
      user_sleep_assessment,
      user_additional_info,
      users,
      created_at,
    } = assessment;

    const { physical_activities_group, physical_activities_tier, social_abilities, quality_of_life, sleep_assessment } =
      conditionAssessmentScores;

    const documentContent = this.getDocumentContentByLang({
      users,
      user_physical_activities,
      user_cognitive_abilities,
      physical_activities_group,
      physical_activities_tier,
      social_abilities,
      quality_of_life,
      sleep_assessment,
      user_social_abilities,
      user_quality_of_life,
      user_sleep_assessment,
      user_additional_info,
      formalCaregivers,
      created_at,
      lang,
    });

    await doc.renderAsync(documentContent);

    const docxBuffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    const convertAsync = promisify(libre.convert);

    const pdfBuf = await convertAsync(docxBuffer, '.pdf', undefined);

    return createResponse(HttpStatus.OK, pdfBuf, 'Pdf created');
  }

  async deleteUser(caregiverId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(caregiverId, ['users']);
    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: loggedInAdmin.id,
        },
      },
      relations: ['status'],
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, { lang }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, { lang }),
      );
    }

    loggedInAdmin.users = loggedInAdmin.users.filter((user) => user.id !== seniorId);
    await this.adminRepository.save(loggedInAdmin);

    user.status.status_name = EStatus.INACTIVE;

    const maskedUser = this.maskFields(user);

    await this.userRepository.save(maskedUser);
    await this.userRepository.softDelete(seniorId);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.DELETE_USER.user_deleted.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminCaregiverResponseKey}.service.DELETE_USER.user_deleted.notification.message`, {
        lang,
      }),
    );
  }

  async getQrCode(): Promise<TResponse<string>> {
    try {
      const url = this.configService.get('landingPage');
      const qrCodeDataURL = await QRCode.toDataURL(url);
      return createResponse(HttpStatus.OK, qrCodeDataURL, 'QR code generated');
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Failed to generate QR code');
    }
  }

  async getFormalCaregiver(
    id: number,
    userId: number,
  ): Promise<TResponse<{ formalCaregiver: Admin; address: Address }>> {
    const loggedInAdmin = await this.adminRepository.findOne({
      where: { id: userId },
      relations: ['institution'],
    });

    if (!loggedInAdmin) {
      return createResponse(HttpStatus.UNAUTHORIZED, null, 'Logged in admin not found');
    }

    const formalCaregiver = await this.adminRepository.findOne({
      where: { id },
      relations: ['workingHours', 'workingHours.days', 'caregiver_roles', 'institution', 'roles'],
    });
    const hasFormalCaregiverRole = formalCaregiver?.roles.find((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (!formalCaregiver || !hasFormalCaregiverRole) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Formal Caregiver not found');
    }

    if (formalCaregiver.institution.id !== loggedInAdmin.institution.id) {
      return createResponse(HttpStatus.FORBIDDEN, null, 'Not in the same institution');
    }

    const { details } = await this.adminInstitutionService.getImage(id, Admin);
    const image = typeof details === 'string' ? details : null;

    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id: formalCaregiver.id,
        },
      },
    });

    delete formalCaregiver.institution;
    delete formalCaregiver.first_login;

    const fetchedCaregiver = {
      formalCaregiver: {
        ...formalCaregiver,
        avatar: image,
      },
      address,
    };

    return createResponse(HttpStatus.OK, fetchedCaregiver, 'Formal caregiver fetched');
  }

  async isANeedDisplayPerformanceWarning(seniorId: number, caregiverId: number): Promise<TResponse<boolean>> {
    const lang = I18nContext.current().lang;
    const performanceResponse = await this.dashboardsService.getUserPerformance(seniorId, caregiverId);

    if (performanceResponse.status !== HttpStatus.OK || !performanceResponse.details) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        false,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const performanceDetails = performanceResponse.details as TSeniorsPerformance;
    const performance = performanceDetails.totalPerformance;

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        admins: {
          id: caregiverId,
        },
      },
      relations: ['user_quality_of_life'],
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        false,
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TCommonResponseKey}.user_not_found.notification.message`, {
          lang,
        }),
      );
    }

    if (!user.user_quality_of_life) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        false,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.assessment_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.assessment_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const createdAt = new Date(user.created_at);
    const today = new Date();
    const daysSinceCreation = (today.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);

    if (daysSinceCreation < 30) {
      return createResponse(
        HttpStatus.OK,
        false,
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_check_not_needed_user_created.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_check_not_needed_user_created.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (user.last_performance_warning) {
      const lastWarningDate = new Date(user.last_performance_warning);
      const daysSinceLastWarning = (today.getTime() - lastWarningDate.getTime()) / (1000 * 3600 * 24);

      if (daysSinceLastWarning < 30) {
        return createResponse(
          HttpStatus.OK,
          false,
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_check_not_needed_last_warning.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.performance_check_not_needed_last_warning.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    const earliestQualityOfLifeRecord = user.user_quality_of_life.reduce((earliest, current) => {
      return new Date(current.created_at) < new Date(earliest.created_at) ? current : earliest;
    });

    const motivation = earliestQualityOfLifeRecord.motivation;

    let requiredPerformance = 0;
    switch (motivation) {
      case EPriority.LOW:
        requiredPerformance = 40;
        break;
      case EPriority.MEDIUM:
        requiredPerformance = 50;
        break;
      case EPriority.HIGH:
        requiredPerformance = 60;
        break;
      default:
        requiredPerformance = 50;
    }

    const isWarningNeeded = performance < requiredPerformance;

    const property = isWarningNeeded ? 'above' : 'below';

    return createResponse(
      HttpStatus.OK,
      isWarningNeeded,
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.below_above_required_level.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminCaregiverResponseKey}.service.NEED_DISPLAY_PERFORMANCE_WARNING.below_above_required_level.notification.message`,
        {
          lang,
          args: { property },
        },
      ),
    );
  }

  async sendPerformanceWarningNotification(seniorId: number, caregiverId: number): Promise<TResponse> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.admins', 'admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .where('user.id = :seniorId', { seniorId })
      .andWhere('admin.id = :caregiverId', { caregiverId })
      .getOne();

    if (!user) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }

    const formalCaregivers = user.admins.filter((admin) =>
      admin.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER),
    );

    if (!formalCaregivers.length) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'No formal caregiver found');
    }

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.MONITORING_VISIT_REQUEST,
      ENotificationPriority.HIGH,
      formalCaregivers.map((caregiver) => ({ id: caregiver.id, email_address: caregiver.email_address })),
      user.first_name + ' ' + user.last_name,
    );

    user.last_performance_warning = new Date();
    await this.userRepository.save(user);

    return createResponse(HttpStatus.OK, null, 'Performance warning notification sent');
  }

  formatReportDate(isoDateString: Date): string {
    const day = String(isoDateString.getUTCDate()).padStart(2, '0');
    const month = String(isoDateString.getUTCMonth() + 1).padStart(2, '0');
    const year = isoDateString.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  formatReportVariableName(name: string | null | undefined): string | null | undefined {
    if (!name) {
      return name;
    }

    return name
      .split('_')
      .map((word, index) =>
        word.toLowerCase() === 'activities'
          ? ''
          : index === 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.toLowerCase(),
      )
      .filter(Boolean)
      .join(' ');
  }

  getDocumentContentByLang({
    users,
    user_physical_activities,
    user_cognitive_abilities,
    physical_activities_group,
    physical_activities_tier,
    social_abilities,
    quality_of_life,
    sleep_assessment,
    user_social_abilities,
    user_quality_of_life,
    user_sleep_assessment,
    user_additional_info,
    formalCaregivers,
    created_at,
    lang = 'en',
  }: TDocumentContentPayload): Record<string, string | boolean | number> {
    const langOptions = {
      lang,
      defaultValue: '-',
    };
    const translationKeys = this.i18n.getTranslations()[lang] as TGetTranslations;
    const translatedKeys = translationKeys.translation.assessment_report.keys;
    const translatedAnswers = {
      if_bedridden: user_physical_activities.currently_bedridden,
      moca_scoring: user_cognitive_abilities.moca_scoring,
      first_name: users.first_name,
      last_name: users.last_name,
      created_at: this.formatReportDate(created_at),
      caregiver_first_name: formalCaregivers[0].first_name,
      caregiver_last_name: formalCaregivers[0].last_name,
      activity_level_1: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.activities.${physical_activities_group}`,
        langOptions,
      ),
      activity_level_2:
        this.i18n.t(`${TAssessmentReportAnswerKeys}.levels.${physical_activities_tier}`, langOptions) ?? null,
      emotional_loneliness: social_abilities,
      social_loneliness: social_abilities,
      quality_of_life: quality_of_life,
      sleep: sleep_assessment,

      currently_bedridden: user_physical_activities.currently_bedridden
        ? this.i18n.t(`${TAssessmentReportAnswerKeys}.common.yes`, langOptions)
        : this.i18n.t(`${TAssessmentReportAnswerKeys}.common.no`, langOptions),
      can_walk_without_support: user_physical_activities.can_walk_without_support
        ? this.i18n.t(`${TAssessmentReportAnswerKeys}.common.yes`, langOptions)
        : this.i18n.t(`${TAssessmentReportAnswerKeys}.common.no`, langOptions),
      severe_balance_problems: user_physical_activities.severe_balance_problems
        ? this.i18n.t(`${TAssessmentReportAnswerKeys}.common.yes`, langOptions)
        : this.i18n.t(`${TAssessmentReportAnswerKeys}.common.no`, langOptions),

      vigorous_activity_days_last_week: user_physical_activities.vigorous_activity_days_last_week,
      vigorous_activity_minutes_per_day: user_physical_activities.vigorous_activity_minutes_per_day,
      moderate_activity_days_last_week: user_physical_activities.moderate_activity_days_last_week,
      moderate_activity_minutes_per_day: user_physical_activities.moderate_activity_minutes_per_day,
      walking_days_last_week: user_physical_activities.walking_days_last_week,
      walking_minutes_per_day: user_physical_activities.walking_minutes_per_day,
      time_sitting_last_week: user_physical_activities.time_sitting_last_week,
      experience_of_emptiness: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.experience_of_emptiness}`,
        langOptions,
      ),
      miss_having_people_around: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.miss_having_people_around}`,
        langOptions,
      ),
      feel_rejected: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.feel_rejected}`,
        langOptions,
      ),
      rely_on_people: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.rely_on_people}`,
        langOptions,
      ),
      trust_completely: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.trust_completely}`,
        langOptions,
      ),
      enough_people_feel_close: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.common.${user_social_abilities.enough_people_feel_close}`,
        langOptions,
      ),
      motivation: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.levels.${user_quality_of_life.motivation.toLowerCase()}`,
        langOptions,
      ),
      mobility: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality_of_life.mobility.${user_quality_of_life?.mobility}`,
        langOptions,
      ),
      self_care: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality_of_life.self_care.${user_quality_of_life?.self_care}`,
        langOptions,
      ),
      usual_activities: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality_of_life.usual_activities.${user_quality_of_life?.usual_activities}`,
        langOptions,
      ),
      pain_discomfort: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality_of_life.pain_discomfort.${user_quality_of_life?.pain_discomfort}`,
        langOptions,
      ),
      anxiety_depression: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality_of_life.anxiety_depression.${user_quality_of_life?.anxiety_depression}`,
        langOptions,
      ),
      general_health: user_quality_of_life.general_health,
      bed_time: this.formatReportVariableName(user_sleep_assessment.bed_time),
      fall_asleep_duration: user_sleep_assessment.fall_asleep_duration,
      wake_up_time: this.formatReportVariableName(user_sleep_assessment.wake_up_time),
      actual_sleep_hours: user_sleep_assessment.actual_sleep_hours,
      cannot_sleep_within_30_minutes: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.cannot_sleep_within_30_minutes}`,
        langOptions,
      ),
      wake_up_midnight_or_early_morning: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.wake_up_midnight_or_early_morning}`,
        langOptions,
      ),
      need_to_use_bathroom: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.need_to_use_bathroom}`,
        langOptions,
      ),
      cannot_breathe_comfortably: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.cannot_breathe_comfortably}`,
        langOptions,
      ),
      cough_or_snore_loudly: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.cough_or_snore_loudly}`,
        langOptions,
      ),
      feel_too_cold: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.feel_too_cold}`,
        langOptions,
      ),
      feel_too_hot: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.feel_too_hot}`,
        langOptions,
      ),
      had_bad_dreams: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.had_bad_dreams}`,
        langOptions,
      ),
      other_reasons_for_trouble_sleeping: this.formatReportVariableName(
        user_sleep_assessment.other_reasons_for_trouble_sleeping,
      ),
      medicine_for_sleep: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.medicine_for_sleep}`,
        langOptions,
      ),
      trouble_staying_awake_frequency: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.trouble_staying_awake_frequency}`,
        langOptions,
      ),
      enthusiasm_to_get_things_done: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.enthusiasm.${user_sleep_assessment.enthusiasm_to_get_things_done}`,
        langOptions,
      ),
      sleep_quality_rating: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.quality.${user_sleep_assessment.sleep_quality_rating}`,
        langOptions,
      ),
      have_bed_partner_or_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.bed_partner_or_room_mate.${user_sleep_assessment.have_bed_partner_or_room_mate}`,
        langOptions,
      ),
      loud_snoring: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.loud_snoring}`,
        langOptions,
      ),
      breathing_pause: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.breathing_pause}`,
        langOptions,
      ),
      legs_twitching: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.legs_twitching}`,
        langOptions,
      ),
      sleep_disorientation: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.sleep_disorientation}`,
        langOptions,
      ),
      cough_or_snore_loudly_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.cough_or_snore_loudly_room_mate}`,
        langOptions,
      ),
      feel_too_cold_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.feel_too_cold_room_mate}`,
        langOptions,
      ),
      feel_too_hot_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.feel_too_hot_room_mate}`,
        langOptions,
      ),
      had_bad_dreams_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.had_bad_dreams_room_mate}`,
        langOptions,
      ),
      have_pain_room_mate: this.i18n.t(
        `${TAssessmentReportAnswerKeys}.frequency.${user_sleep_assessment.have_pain_room_mate}`,
        langOptions,
      ),
      other_restlessness: this.formatReportVariableName(user_sleep_assessment.other_restlessness),
      additional_info: this.formatReportVariableName(user_additional_info?.notes),
    };

    return {
      ...translatedKeys,
      ...translatedAnswers,
    };
  }

  async userPerformanceWarning(userId: number): Promise<boolean> {
    const { user_quality_of_life } =
      (await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['user_quality_of_life'],
        select: ['user_quality_of_life'],
      })) || {};

    const { totalPerformance } =
      ((await this.dashboardsService.getUserPerformance(userId)).details as TSeniorsPerformance) || {};

    if (!user_quality_of_life.length || totalPerformance == null) {
      return null;
    }

    const { motivation } =
      user_quality_of_life?.reduce((earliest, current) => {
        return new Date(current.created_at) < new Date(earliest.created_at) ? current : earliest;
      }) || {};

    if (!motivation) {
      return null;
    }

    const requiredPerformance = EMotivationPerformance[motivation] || 50;

    return totalPerformance < requiredPerformance;
  }
}
