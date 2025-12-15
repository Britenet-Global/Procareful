import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin, CaregiverRole, Day, Institution, Onboarding, Role, Status, WorkingHours } from '../entities';
import { DataSource, EntityTarget, In, Repository } from 'typeorm';
import {
  AddFormalCaregiverDto,
  AddInformalCaregiverDto,
  AddInstitutionAdminDto,
  GetAdminsInstitutionFilterDto,
  GetFormalCaregiversFilterDto,
  GetInformalCaregiversFilterDto,
  GetUsersFilterDto,
  SetMyPersonalSettingsDto,
  UpdateAdminContactDto,
  UpdateAdminInfoDto,
  UpdateCaregiverContactDto,
  UpdateCaregiverInfoDto,
  UpdateCaregiverRoleDto,
  UpdateContactDto,
  UpdateInfoDto,
  WorkingHoursDto,
} from './dto';
import { createResponse } from 'src/common/responses/createResponse';
import { EWeekdays, TArrayResponse, TControllerType, TResponse } from 'src/common/types';
import { ERole, EStatus } from '../types';
import { Address } from 'src/common/entities/address.entity';
import { User } from '../../user/entities/user.entity';
import { FilterService } from '../../filter/filter.service';
import { createResponseDetails } from '../../common/responses/createResponseDetails';
import { generateKey, hashString } from 'src/utils';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { NestedPaginatedResponseDto, UpdateInstitutionDetailsDto } from '../../common/dto';
import { AdminService } from '../admin.service';
import { SetStatusDto, UpdateInstitutionAdminRoleDto } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { MinioClientService } from 'src/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { OnboardingService } from '../../common/utils/create-onboarding';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ECaregiverRole } from '../caregiver/types';
import { DefaultNotificationSettingsService } from '../../common/utils/create-default-notification-settings';
import { NotificationsService } from '../../notifications/notifications.service';
import { ENotificationPriority, ENotificationTitle } from '../../notifications/types';
import { createPaginatedResponse } from '../../common/responses/createPaginatedResponse';
import { NestedPaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { EmitNotificationsService } from '../../notifications/emit-notifications.service';
import { TAdminInstitutionResponseKey } from '../../common/utils/translationKeys';
import { UserContact } from 'src/admin/caregiver/entities/userContact.entity';

@Injectable()
export class AdminInstitutionService {
  constructor(
    @InjectRepository(Institution)
    private readonly institutionRepository: Repository<Institution>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(WorkingHours)
    private readonly workingHoursRepository: Repository<WorkingHours>,

    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(CaregiverRole)
    private readonly caregiverRoleRepository: Repository<CaregiverRole>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,

    @InjectRepository(UserContact)
    private readonly userContactRepository: Repository<UserContact>,

    private readonly filterService: FilterService,

    private readonly redisService: RedisService,

    private readonly emailService: EmailService,

    private readonly adminService: AdminService,

    private dataSource: DataSource,

    private readonly configService: ConfigService,

    private readonly minioClientService: MinioClientService,

    private onboardingService: OnboardingService,

    private readonly i18n: I18nService,

    private readonly notificationSettingsService: DefaultNotificationSettingsService,

    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationService: NotificationsService,

    private readonly emitNotificationsService: EmitNotificationsService,
  ) {}

  private readonly collectionName = 'tokens';

  private async findAdmin(
    caregiverId: number,
    loggedInAdminId: number,
    caregiverRole: ERole,
    relations: string[],
  ): Promise<Admin> {
    return await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: { id: loggedInAdminId },
        roles: { role_name: caregiverRole },
      },
      relations,
    });
  }

  async updateMyInstitutionDetails(
    userId: number,
    { email, phone, name, ...updateData }: UpdateInstitutionDetailsDto,
  ): Promise<TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;
    const admin = await this.adminRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['institution'],
    });

    if (!admin) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `t${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.admin_not_found.notification.title`,
          {
            lang: lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.admin_not_found.notification.message`,
          {
            lang: lang,
          },
        ),
      );
    }

    if (!admin.institution) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.institution_not_assigned.notification.title`,
          {
            lang: lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.institution_not_assigned.notification.message`,
          {
            lang: lang,
          },
        ),
      );
    }

    const propertiesToCheck = {
      name,
      ...(!!email?.length && { email }),
      ...(!!phone?.length && { phone }),
    };

    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(admin.institution.id, Institution, [
      propertiesToCheck,
    ]);

    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});

    if (Object.keys(errors).length > 0) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        errors,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.property_already_in_use.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.property_already_in_use.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.institutionRepository.update(admin.institution.id, {
      email: !!email?.length ? email : null,
      phone: !!phone?.length ? phone : null,
      name,
      ...updateData,
    });

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.UPDATE_MY_INSTITUTION_DETAILS.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async addInstitutionAdmin(addInstitutionAdminDto: AddInstitutionAdminDto, userId: number): Promise<TResponse<null>> {
    const lang = I18nContext.current().lang;
    const email_address = addInstitutionAdminDto.email_address.toLowerCase();
    const status = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.CREATED,
      },
    });

    if (!status) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.status_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.status_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const role = await this.roleRepository.findOne({
      where: {
        role_name: ERole.ADMIN_INSTITUTION,
      },
    });

    if (!role) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.role_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.role_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const adminInstitution = await this.adminRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['institution', 'country'],
    });

    const admin = new Admin();
    Object.assign(admin, {
      status,
      roles: [role],
      institution: adminInstitution.institution,
      country: adminInstitution.country,
      ...addInstitutionAdminDto,
      email_address,
    });

    await this.adminRepository.save(admin);
    await this.onboardingService.createOnboardingObject(admin, 3);

    const token = generateKey();
    const hashedToken = await hashString(token);

    await this.redisService.saveItemToRedis(email_address, hashedToken, this.collectionName);
    await this.emailService.sendFirstEntryEmail(email_address, token);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_INSTITUTION_ADMIN.success.notification.message`, {
        lang,
      }),
    );
  }

  async getAdminsInstitution(
    filterDto: GetAdminsInstitutionFilterDto,
    userId: number,
  ): Promise<TResponse<TArrayResponse<Admin>>> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    if (!loggedInAdmin) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_ADMINS_INSTITUTION.admins_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_ADMINS_INSTITUTION.admins_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const roles = await this.roleRepository.find({
      where: [{ role_name: ERole.SUPER_ADMIN_INSTITUTION }, { role_name: ERole.ADMIN_INSTITUTION }],
    });

    const rolesIds = roles.map((role) => role.id);

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.institution', 'institution')
      .where('institution.id = :institutionId', { institutionId: loggedInAdmin.institution.id })
      .andWhere('role.id IN (:...rolesIds)', { rolesIds })
      .andWhere('admin.id != :userId', { userId });

    const searchFields = ['first_name', 'last_name', 'email_address'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const admins = await filteredQueryBuilder.getMany();
    const adminsWithRoles = await this.adminRepository.find({
      where: {
        id: In(admins.map((admin) => admin.id)),
      },
      relations: ['status', 'roles', 'institution'],
    });

    const response = createResponseDetails<Admin>(adminsWithRoles, filterDto, total);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ADMINS_INSTITUTION.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ADMINS_INSTITUTION.notification.message`, {
        lang,
      }),
    );
  }

  async getUsers(filterDto: GetUsersFilterDto, userId: number): Promise<TResponse<TArrayResponse<User>>> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    if (!loggedInAdmin) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USERS.admin_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USERS.admin_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.institution', 'institution')
      .leftJoinAndSelect('user.status', 'status')
      .leftJoinAndSelect('user.created_by', 'created_by')
      .where('institution.id = :institutionId', { institutionId: loggedInAdmin.institution.id });

    const searchFields = ['user.first_name', 'user.last_name', 'user.email_address'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const users = await filteredQueryBuilder.getMany();

    const response = createResponseDetails<User>(users, filterDto, total);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USERS.admin_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USERS.admin_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async getUserById(
    seniorId: number,
    userId: number,
    paginationParams: NestedPaginationParamsDto,
  ): Promise<TResponse<{ senior: { admins: NestedPaginatedResponseDto<Admin> }; address: Address }>> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['status', 'created_by'],
    });

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USER_BY_ID.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USER_BY_ID.user_not_found.notification.message`, {
          lang,
        }),
      );
    }
    const address = await this.addressRepository.findOne({
      where: {
        user: {
          id: senior.id,
        },
      },
    });
    const { page, pageSize } = paginationParams;

    const [admins, totalAdmins] = await this.adminRepository.findAndCount({
      where: {
        users: {
          id: senior.id,
        },
        roles: {
          role_name: In([ERole.FORMAL_CAREGIVER]),
        },
      },
      relations: ['roles', 'caregiver_roles'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    for (const admin of admins) {
      const adminWithRoles = await this.adminRepository.findOne({
        where: {
          id: admin.id,
        },
        relations: ['roles'],
      });

      if (adminWithRoles) {
        admin.roles = adminWithRoles.roles;
      }
    }

    const paginatedAdmins = createPaginatedResponse(admins, paginationParams, totalAdmins);

    const result = {
      senior: {
        ...senior,
        admins: paginatedAdmins,
      },
      address,
    };

    return createResponse(
      HttpStatus.OK,
      result,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USER_BY_ID.user_fetched.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_USER_BY_ID.user_fetched.notification.message`, {
        lang,
      }),
    );
  }

  async updateInfoById(
    targetEntityId: number,
    userId: number,
    model: EntityTarget<Admin | User>,
    updateInfoDto: UpdateInfoDto,
  ): Promise<TResponse<User | Admin>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const repository = this.dataSource.getRepository(model);

    const entityToUpdate: Admin | User = await repository.findOne({
      where: {
        id: targetEntityId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
    });

    if (!entityToUpdate) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_INFO_BY_ID.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_INFO_BY_ID.user_not_found.notification.message`, {
          lang,
        }),
      );
    }

    await repository.update(entityToUpdate.id, updateInfoDto);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_INFO_BY_ID.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_INFO_BY_ID.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateContactById(
    targetEntityId: number,
    userId: number,
    modelType: EntityTarget<Admin | User>,
    { phone_number, email_address, address }: UpdateContactDto,
  ): Promise<TResponse<User | Admin | Record<string, string[]>>> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const repository = this.dataSource.getRepository(modelType);

    const entityToUpdate: Admin | User = await repository.findOne({
      where: {
        id: targetEntityId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
    });

    if (!entityToUpdate) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.user_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const propertiesToCheck = { phone_number };
    if (email_address) {
      Object.assign(propertiesToCheck, { email_address });
    }

    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(targetEntityId, modelType, [
      propertiesToCheck,
    ]);
    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});
    if (Object.keys(errors).length > 0) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        errors,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.property_already_in_use.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.property_already_in_use.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    entityToUpdate.email_address = email_address;
    entityToUpdate.phone_number = phone_number;
    await repository.update(entityToUpdate.id, { phone_number, email_address });

    const existingAddress = await this.addressRepository.findOne({
      where: {
        user: { id: targetEntityId },
      },
    });

    const addressEntity = existingAddress || new Address();
    Object.assign(addressEntity, address);
    if (entityToUpdate instanceof User) {
      addressEntity.user = entityToUpdate;
    } else if (entityToUpdate instanceof Admin) {
      addressEntity.admin = entityToUpdate;
    }
    await this.addressRepository.save(addressEntity);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_CONTACT_BY_ID.success.notification.message`, {
        lang,
      }),
    );
  }

  async getInstitutionDetails(userId: number): Promise<TResponse | TResponse<Institution>> {
    const lang = I18nContext.current().lang;
    const admin = await this.adminRepository.findOne({
      where: { id: userId },
      relations: ['institution'],
    });
    if (!admin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_DETAILS.admin_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_DETAILS.admin_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    return createResponse(
      HttpStatus.OK,
      admin.institution,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_DETAILS.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_DETAILS.notification.message`, {
        lang,
      }),
    );
  }

  async addFormalCaregiver({ address, ...adminData }: AddFormalCaregiverDto, userId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const email_address = adminData.email_address.toLowerCase();
    const [status, role] = await Promise.all([
      this.statusRepository.findOne({
        where: { status_name: EStatus.CREATED },
      }),
      this.roleRepository.findOne({
        where: { role_name: ERole.FORMAL_CAREGIVER },
      }),
    ]);
    if (!status) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.status_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.status_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (!role) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.role_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.role_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const adminInstitution = await this.adminRepository.findOne({
      where: { id: userId },
      relations: ['institution', 'country'],
    });

    const admin = new Admin();
    Object.assign(admin, {
      status,
      roles: [role],
      institution: adminInstitution.institution,
      country: adminInstitution.country,
      ...adminData,
      email_address,
    });
    await this.adminRepository.save(admin);

    await Promise.all([
      this.onboardingService.createOnboardingObject(admin, 5),
      this.notificationSettingsService.createDefaultNotificationSettings(admin, ERole.FORMAL_CAREGIVER),
    ]);

    if (address) {
      const addressEntity = new Address();
      Object.assign(addressEntity, address);
      addressEntity.admin = admin;

      await this.addressRepository.save(addressEntity);
    }

    const token = generateKey();
    const hashedToken = await hashString(token);

    await this.redisService.saveItemToRedis(email_address, hashedToken, this.collectionName);
    await this.emailService.sendFirstEntryEmail(email_address, token);

    return createResponse(
      HttpStatus.CREATED,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_FORMAL_CAREGIVER.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateCaregiverInfo(
    userId: number,
    adminId: number,
    caregiver: ERole.FORMAL_CAREGIVER | ERole.INFORMAL_CAREGIVER,
    { first_name, last_name }: UpdateCaregiverInfoDto,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (!loggedInAdmin.institution) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(
          `t${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.no_institution.notification.title`,
          { lang },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.no_institution.notification.message`,
          { lang },
        ),
      );
    }

    const caregiverToUpdate = await this.findAdmin(userId, loggedInAdmin.institution.id, caregiver, ['roles']);

    if (!caregiverToUpdate) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.caregiver_not_found.notification.title`,
          { lang },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.caregiver_not_found.notification.message`,
          { lang },
        ),
      );
    }

    const informalCaregiverContactToUpdate = await this.userContactRepository.findOne({
      where: {
        first_name: caregiverToUpdate.first_name,
        last_name: caregiverToUpdate.last_name,
      },
    });

    caregiverToUpdate.first_name = first_name;
    caregiverToUpdate.last_name = last_name;

    if (informalCaregiverContactToUpdate) {
      informalCaregiverContactToUpdate.first_name = first_name;
      informalCaregiverContactToUpdate.last_name = last_name;
    }

    try {
      await queryRunner.manager.save(caregiverToUpdate);
      informalCaregiverContactToUpdate && (await queryRunner.manager.save(informalCaregiverContactToUpdate));
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.success.notification.title`, { lang }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_CAREGIVER_INFO.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateAdminRoles(
    myId: number,
    adminId: number,
    updateRoleDto: UpdateInstitutionAdminRoleDto,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const { roleToAssign, roleToRemove } = updateRoleDto;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(myId, ['institution', 'roles']);

    if (!loggedInAdmin.institution) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_institution.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_institution.notification.message`, {
          lang,
        }),
      );
    }

    const adminToUpdate = await this.adminRepository.findOne({
      where: {
        id: adminId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles', 'institution'],
    });

    if (!adminToUpdate) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.admin_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.admin_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const roles = adminToUpdate.roles.map((role) => role.role_name);

    const hasRequiredRole = roles.includes(ERole.FORMAL_CAREGIVER) || roles.includes(ERole.ADMIN_INSTITUTION);

    if (!hasRequiredRole) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.admin_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.admin_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const roleExists = (role: ERole): boolean => roles.includes(role);
    let rolesUpdated = false;

    if (roleToAssign) {
      if (!roleExists(roleToAssign)) {
        const targetRole = await this.roleRepository.findOne({
          where: {
            role_name: roleToAssign,
          },
        });

        if (!targetRole) {
          return createResponse(
            HttpStatus.NOT_FOUND,
            null,
            this.i18n.t(
              `t${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_not_found.notification.title`,
              { lang },
            ),
            this.i18n.t(
              `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_not_found.notification.message`,
              { lang },
            ),
          );
        }

        adminToUpdate.roles.push(targetRole);
        rolesUpdated = true;
      } else {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_already_assigned.notification.title`,
            { lang },
          ),
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_already_assigned.notification.message`,
            { lang },
          ),
        );
      }
    }

    if (roleToRemove) {
      if (roleExists(roleToRemove)) {
        const roleToRemoveEntity = await this.roleRepository.findOne({
          where: {
            role_name: roleToRemove,
          },
        });

        if (!roleToRemoveEntity) {
          return createResponse(
            HttpStatus.NOT_FOUND,
            null,
            this.i18n.t(
              `t${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_not_found.notification.title`,
              { lang },
            ),
            this.i18n.t(
              `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.role_not_found.notification.message`,
              { lang },
            ),
          );
        }

        adminToUpdate.roles = adminToUpdate.roles.filter((role) => role.id !== roleToRemoveEntity.id);
        rolesUpdated = true;

        if (adminToUpdate.roles.length === 0) {
          return createResponse(
            HttpStatus.BAD_REQUEST,
            null,
            this.i18n.t(
              `t${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.cannot_remove_role.notification.title`,
              { lang },
            ),
            this.i18n.t(
              `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.cannot_remove_role.notification.message`,
              { lang },
            ),
          );
        }
      } else {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `t${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_role_to_remove.notification.title`,
            { lang },
          ),
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_role_to_remove.notification.message`,
            { lang },
          ),
        );
      }
    }

    if (!rolesUpdated) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_role_changes.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.no_role_changes.notification.message`, {
          lang,
        }),
      );
    }

    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id: adminId,
        },
      },
    });

    if (onboarding && roleToAssign === ERole.FORMAL_CAREGIVER) {
      [...Array(6).keys()].reduce((onboarding, index) => {
        const step = index + 1;
        onboarding[`step${step}`] = step <= 4 ? false : null;
        return onboarding;
      }, onboarding);

      await this.onboardingRepository.save(onboarding);
    }

    await this.adminRepository.save(adminToUpdate);

    this.emitNotificationsService.emitRoleUpdatedEvent(adminId, ENotificationTitle.ROLE_UPDATED);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.success.notification.title`, { lang }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_ROLES.success.notification.message`, { lang }),
    );
  }

  async getFormalCaregiverRoles(caregiverId: number): Promise<TResponse<ECaregiverRole[]>> {
    const lang = I18nContext.current().lang;
    const formalCaregiver = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
      },
      relations: ['caregiver_roles'],
    });

    if (!formalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_FORMAL_CAREGIVER_ROLES.caregiver_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_FORMAL_CAREGIVER_ROLES.caregiver_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    const roles = formalCaregiver.caregiver_roles?.map((role) => role.role_name);

    return createResponse(
      HttpStatus.OK,
      roles,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_FORMAL_CAREGIVER_ROLES.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_FORMAL_CAREGIVER_ROLES.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateFormalCaregiverRoles(
    userId: number,
    dto: UpdateCaregiverRoleDto,
    caregiverId: number,
  ): Promise<TResponse> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution', 'roles']);

    if (!loggedInAdmin.institution) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Admin does not belong to any institution');
    }

    const formalCaregiverToUpdate = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles', 'caregiver_roles', 'institution'],
    });

    const isFC = formalCaregiverToUpdate?.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (!formalCaregiverToUpdate || !isFC) {
      return createResponse(HttpStatus.NOT_FOUND, null, `Formal Caregiver not found`);
    }

    const newCaregiverRoles = await this.caregiverRoleRepository.find({
      where: {
        role_name: In(dto.role_name),
      },
    });

    if (newCaregiverRoles.length !== dto.role_name.length) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'At least one of given roles does not exists');
    }

    formalCaregiverToUpdate.caregiver_roles = newCaregiverRoles;

    await this.adminRepository.save(formalCaregiverToUpdate);

    this.emitNotificationsService.emitRoleUpdatedEvent(caregiverId, ENotificationTitle.ROLE_UPDATED);

    return createResponse(HttpStatus.OK, null, 'Formal Caregiver roles updated');
  }

  async getInformalCaregivers(
    filterDto: GetInformalCaregiversFilterDto,
    userId: number,
  ): Promise<TResponse<TArrayResponse<Admin>>> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution', 'roles']);

    if (!loggedInAdmin) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Admin not found');
    }

    const role = await this.roleRepository.findOne({
      where: { role_name: ERole.INFORMAL_CAREGIVER },
    });

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.institution', 'institution')
      .leftJoinAndSelect('admin.status', 'status')
      .where('institution.id = :institutionId', { institutionId: loggedInAdmin.institution.id })
      .andWhere('role.id = :roleId', { roleId: role.id })
      .andWhere('admin.id != :userId', { userId });

    const searchFields = ['first_name', 'last_name', 'email_address'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const admins = await filteredQueryBuilder.getMany();

    const response = createResponseDetails<Admin>(admins, filterDto, total);

    return createResponse(HttpStatus.OK, response, 'Informal Caregivers');
  }

  async updateCaregiverContact(
    id: number,
    userId: number,
    caregiver: ERole.FORMAL_CAREGIVER | ERole.INFORMAL_CAREGIVER,
    { email_address, phone_number, address }: UpdateCaregiverContactDto,
    updatedByCaregiver = false,
  ): Promise<TResponse<Record<string, string[]> | User | Admin>> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const caregiverToUpdate = await this.findAdmin(id, loggedInAdmin.institution.id, caregiver, ['roles']);

    if (!caregiverToUpdate) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Informal Caregiver not found');
    }
    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(id, Admin, [
      { email_address, phone_number },
    ]);
    const errors = nonUniqueProperties.reduce((acc: Record<string, string[]>, curr) => {
      acc[curr] = [`${curr} is already in use`];
      return acc;
    }, {});
    if (Object.keys(errors).length > 0) {
      return createResponse(HttpStatus.BAD_REQUEST, errors, 'Property already in use');
    }

    const informalCaregiverContactToUpdate = await this.userContactRepository.findOne({
      where: {
        email_address: caregiverToUpdate.email_address,
      },
    });

    if (email_address || phone_number) {
      caregiverToUpdate.email_address = email_address;
      caregiverToUpdate.phone_number = phone_number;
      if (informalCaregiverContactToUpdate) {
        informalCaregiverContactToUpdate.email_address = email_address;
        informalCaregiverContactToUpdate.phone_number = phone_number;
      }
    }

    try {
      await queryRunner.manager.save(caregiverToUpdate);
      informalCaregiverContactToUpdate && (await queryRunner.manager.save(informalCaregiverContactToUpdate));
      if (address) {
        const existingAddress = await this.addressRepository.findOne({
          where: {
            admin: {
              id,
            },
          },
        });

        const addressEntity = existingAddress || new Address();
        Object.assign(addressEntity, address);
        addressEntity.admin = caregiverToUpdate;

        await queryRunner.manager.save(addressEntity);

        if (!updatedByCaregiver) {
          let existingAddressByUserContactId = new Address();

          if (informalCaregiverContactToUpdate?.id) {
            const findExistingAddressByUserContactId = await this.addressRepository.findOne({
              where: {
                user_contact: {
                  id: informalCaregiverContactToUpdate?.id,
                },
              },
            });

            if (findExistingAddressByUserContactId) {
              existingAddressByUserContactId = findExistingAddressByUserContactId;
            }
          }

          Object.assign(existingAddressByUserContactId, address);
          await queryRunner.manager.save(existingAddressByUserContactId);
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return createResponse(HttpStatus.OK, null, 'Informal Caregiver basic info updated');
  }

  async getFormalCaregivers(
    filterDto: GetFormalCaregiversFilterDto,
    userId: number,
  ): Promise<TResponse<TArrayResponse<Admin>>> {
    const [existingAdmin, role] = await Promise.all([
      this.adminRepository.findOne({
        where: { id: userId },
        relations: ['institution', 'roles', 'caregiver_roles', 'users'],
      }),
      this.roleRepository.findOne({
        where: { role_name: ERole.FORMAL_CAREGIVER },
      }),
    ]);
    if (!existingAdmin) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Admin not found');
    }

    if (!role) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Role not found');
    }
    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.institution', 'institution')
      .leftJoinAndSelect('admin.status', 'status')
      .leftJoinAndSelect('admin.caregiver_roles', 'caregiver_roles')
      .where('institution.id = :institutionId', { institutionId: existingAdmin.institution.id })
      .andWhere('role.id = :roleId', { roleId: role.id })
      .andWhere('admin.id != :userId', { userId });

    const searchFields = ['first_name', 'last_name', 'email_address'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();
    const total = await totalQueryBuilder.getCount();

    const admins = await filteredQueryBuilder.getMany();

    const filteredAdmins = await this.adminRepository.find({
      where: {
        id: In(admins.map((admin) => admin.id)),
      },
      relations: ['roles', 'institution', 'status', 'caregiver_roles'],
    });

    const response = createResponseDetails<Admin>(filteredAdmins, filterDto, total);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t('translation.admin_institution.GET_FORMAL_CAREGIVERS.notification.title', {
        lang: I18nContext.current().lang,
      }),
      this.i18n.t('translation.admin_institution.GET_FORMAL_CAREGIVERS.notification.message', {
        lang: I18nContext.current().lang,
      }),
    );
  }

  async getFormalCaregiversAvailableForUser(
    filterDto: GetInformalCaregiversFilterDto,
    adminId: number,
    userId: number,
  ): Promise<TResponse<TArrayResponse<Admin>>> {
    const [existingAdmin, role] = await Promise.all([
      this.adminRepository.findOne({
        where: { id: adminId },
        relations: ['institution'],
      }),
      this.roleRepository.findOne({
        where: { role_name: ERole.FORMAL_CAREGIVER },
      }),
    ]);

    if (!existingAdmin) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Admin not found');
    }

    if (!role) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'Role not found');
    }

    const senior = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['admins'],
    });

    if (!senior) {
      return createResponse(HttpStatus.BAD_REQUEST, null, 'User not found');
    }

    const assignedCaregiverIds = senior.admins.map((cg) => cg.id);

    const queryBuilder = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.roles', 'role')
      .leftJoinAndSelect('admin.institution', 'institution')
      .leftJoinAndSelect('admin.status', 'status')
      .leftJoinAndSelect('admin.caregiver_roles', 'caregiver_roles')
      .where('institution.id = :institutionId', { institutionId: existingAdmin.institution.id })
      .andWhere('role.id = :roleId', { roleId: role.id })
      .andWhere('status.status_name != :statusName', { statusName: EStatus.INACTIVE });

    if (assignedCaregiverIds.length) {
      queryBuilder.andWhere('admin.id NOT IN (:...assignedCaregiverIds)', { assignedCaregiverIds });
    }

    const searchFields = ['first_name', 'last_name', 'email_address'];

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto, searchFields);
    const totalQueryBuilder = filteredQueryBuilder.clone();

    const [admins, total] = await Promise.all([filteredQueryBuilder.getMany(), totalQueryBuilder.getCount()]);

    const response = createResponseDetails<Admin>(admins, filterDto, total);

    return createResponse(HttpStatus.OK, response, 'Formal caregivers fetched');
  }

  async getFormalCaregiver(
    id: number,
    userId: number,
    paginationParams: NestedPaginationParamsDto,
  ): Promise<TResponse<{ formalCaregiver: { users: NestedPaginatedResponseDto<User> }; address: Address }>> {
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const formalCaregiver = await this.adminRepository.findOne({
      where: {
        id,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['status', 'roles', 'caregiver_roles', 'institution'],
    });
    const hasFormalCaregiverRole = formalCaregiver?.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);
    if (!formalCaregiver || !hasFormalCaregiverRole) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Formal Caregiver not found');
    }
    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id: formalCaregiver.id,
        },
      },
    });

    const { page, pageSize } = paginationParams;
    const users = await this.userRepository.find({
      where: {
        admins: {
          id: formalCaregiver.id,
        },
      },
      relations: ['admins.roles'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const allUsers = await this.userRepository.find({
      where: {
        institution: {
          id: formalCaregiver.institution.id,
        },
      },
      relations: ['admins', 'admins.roles'],
    });

    const filteredUsers = allUsers.filter((user) => users.some((u) => u.id === user.id));

    filteredUsers.forEach((user) => {
      user.admins = user.admins.filter((admin) =>
        admin.roles.some(
          (role) => role.role_name === ERole.FORMAL_CAREGIVER || role.role_name === ERole.INFORMAL_CAREGIVER,
        ),
      );
    });

    const paginatedUsers = createPaginatedResponse(filteredUsers, paginationParams, filteredUsers.length);

    const result = {
      formalCaregiver: {
        ...formalCaregiver,
        users: paginatedUsers,
      },
      address,
    };

    return createResponse(HttpStatus.OK, result, 'Formal Caregiver');
  }

  async getInformalCaregiver(
    id: number,
    userId: number,
    paginationParams: NestedPaginationParamsDto,
  ): Promise<TResponse<{ informalCaregiver: { users: NestedPaginatedResponseDto<User> }; address: Address }>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const informalCaregiver = await this.findAdmin(id, loggedInAdmin.institution.id, ERole.INFORMAL_CAREGIVER, [
      'status',
      'roles',
      'users',
    ]);

    if (!informalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INFORMAL_CAREGIVER.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INFORMAL_CAREGIVER.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const address = await this.addressRepository.findOne({
      where: {
        admin: {
          id: informalCaregiver.id,
        },
      },
    });

    const { page, pageSize } = paginationParams;
    const [users, totalUsers] = await this.userRepository.findAndCount({
      where: {
        admins: {
          id: informalCaregiver.id,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const paginatedUsers = createPaginatedResponse(users, paginationParams, totalUsers);

    const result = {
      informalCaregiver: {
        ...informalCaregiver,
        users: paginatedUsers,
      },
      address,
    };

    return createResponse(
      HttpStatus.OK,
      result,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INFORMAL_CAREGIVER.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INFORMAL_CAREGIVER.success.notification.message`, {
        lang,
      }),
    );
  }

  async addInformalCaregiver(
    { address, ...adminData }: AddInformalCaregiverDto,
    userId: number,
  ): Promise<TResponse<{ id: number }> | null> {
    const lang = I18nContext.current().lang;

    const email_address = adminData.email_address.toLowerCase();
    const status = await this.statusRepository.findOne({
      where: {
        status_name: EStatus.CREATED,
      },
    });

    if (!status) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.status_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.status_not_found.notification.message`,
          {
            lang,
            args: { property: EStatus.CREATED },
          },
        ),
      );
    }

    const role = await this.roleRepository.findOne({
      where: {
        role_name: ERole.INFORMAL_CAREGIVER,
      },
    });

    if (!role) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.role_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.role_not_found.notification.message`,
          {
            lang,
            args: { property: ERole.INFORMAL_CAREGIVER },
          },
        ),
      );
    }

    const adminInstitution = await this.adminRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['institution', 'country'],
    });

    const admin = new Admin();
    Object.assign(admin, {
      status,
      roles: [role],
      institution: adminInstitution.institution,
      country: adminInstitution.country,
      ...adminData,
      email_address,
    });
    await this.adminRepository.save(admin);

    await Promise.all([
      this.onboardingService.createOnboardingObject(admin, 3),
      this.notificationSettingsService.createDefaultNotificationSettings(admin, ERole.INFORMAL_CAREGIVER),
    ]);

    if (address) {
      const addressEntity = new Address();
      Object.assign(addressEntity, address);
      addressEntity.admin = admin;

      await this.addressRepository.save(addressEntity);
    }

    const token = generateKey();
    const hashedToken = await hashString(token);

    await this.redisService.saveItemToRedis(email_address, hashedToken, this.collectionName);
    await this.emailService.sendFirstEntryEmail(email_address, token);

    return createResponse(
      HttpStatus.CREATED,
      { id: admin.id },
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.success.notification.message`, {
        lang,
      }),
    );
  }

  async updateWorkingHours(
    adminId: number,
    dto: WorkingHoursDto,
    controllerType: TControllerType.INSTITUTION | TControllerType.CAREGIVER,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: [
        'institution',
        'institution.workingHours',
        'institution.workingHours.days',
        'workingHours',
        'workingHours.days',
      ],
    });

    const conditionsAndParams = {
      institution: {
        condition: admin && admin.institution,
        workingHoursSource: () => admin.institution.workingHours,
        notFoundMessage: this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.user_or_institution_not_found.notification.title`,
          {
            lang,
          },
        ),
        createParams: () => ({
          institution: admin.institution,
          admin: admin,
        }),
      },
      caregiver: {
        condition: admin,
        workingHoursSource: () => admin.workingHours,
        notFoundMessage: this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ADD_INFORMAL_CAREGIVER.caregiver_not_found.notification.title`,
          {
            lang,
          },
        ),
        createParams: () => ({
          admin: admin,
        }),
      },
    };

    const { condition, workingHoursSource, notFoundMessage, createParams } = conditionsAndParams[controllerType];

    if (!condition) {
      return createResponse(HttpStatus.NOT_FOUND, null, notFoundMessage);
    }

    let contactDetails = workingHoursSource();

    if (!contactDetails) {
      contactDetails = this.workingHoursRepository.create(createParams());
    }

    if ('phone' in dto) {
      contactDetails.phone = dto.phone;
    }

    if ('email' in dto) {
      contactDetails.email = dto.email;
    }

    await this.workingHoursRepository.save(contactDetails);

    const updatedDayNames = dto.days?.map((day) => day.name);
    const daysToRemove = contactDetails.days?.filter((day) => !updatedDayNames?.includes(day.name as EWeekdays)) || [];
    for (const day of daysToRemove) {
      await this.dayRepository.remove(day);
    }

    for (const dayDto of dto.days || []) {
      let day = contactDetails.days?.find((d) => d.name === dayDto.name);

      if (day) {
        day.start = dayDto.start;
        day.end = dayDto.end;
      } else {
        day = this.dayRepository.create({
          ...dayDto,
          workingHours: contactDetails,
        });
      }

      await this.dayRepository.save(day);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_WORKING_HOURS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_WORKING_HOURS.success.notification.message`, {
        lang,
      }),
    );
  }
  async getWorkingHours(
    userId: number,
    controllerType: TControllerType.INSTITUTION | TControllerType.CAREGIVER,
  ): Promise<TResponse<WorkingHours>> {
    const lang = I18nContext.current().lang;

    const config = {
      institution: {
        relations: ['institution.workingHours.days'],
        getWorkingHours: (admin: Admin) => admin.institution?.workingHours,
        notFoundMessage: this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.no_working_hours_for_this_institution.notification.title`,
          {
            lang,
          },
        ),
      },
      caregiver: {
        relations: ['institution', 'workingHours.days'],
        getWorkingHours: (admin: Admin) => admin.workingHours,
        notFoundMessage: this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.no_working_hours_for_this_caregiver.notification.title`,
          {
            lang,
          },
        ),
      },
    };

    const { relations, getWorkingHours, notFoundMessage } = config[controllerType];

    const admin = await this.adminService.findLoggedInAdmin(userId, relations);

    if (!admin || !admin.institution) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.admin_institution_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.admin_institution_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const workingHours = getWorkingHours(admin);
    if (!workingHours) {
      return createResponse(HttpStatus.OK, null, notFoundMessage);
    }

    return createResponse(
      HttpStatus.OK,
      workingHours,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_WORKING_HOURS.success.notification.message`, {
        lang,
      }),
    );
  }

  async getInstitutionAdmin(id: number, userId: number): Promise<TResponse<Admin>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const institutionAdmin = await this.adminRepository.findOne({
      where: {
        id,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['status', 'roles', 'users'],
    });
    const hasAdminInstitutionRole = institutionAdmin?.roles.find((role) => role.role_name === ERole.ADMIN_INSTITUTION);

    if (!institutionAdmin || !hasAdminInstitutionRole) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_ADMIN.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_ADMIN.not_found.notification.message`, {
          lang,
        }),
      );
    }
    const assignedUsers = !!institutionAdmin.users.length;

    delete institutionAdmin.password;
    delete institutionAdmin.users;

    return createResponse(
      HttpStatus.OK,
      { ...institutionAdmin, assignedUsers },
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_ADMIN.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_INSTITUTION_ADMIN.success.notification.message`, {
        lang,
      }),
    );
  }

  async editSeniorsFormalCaregiver(seniorId: number, newFormalCaregiverId: number, userId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
        admins: {
          roles: {
            role_name: In([ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER]),
          },
        },
      },
      relations: ['admins.roles'],
    });

    if (!senior) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.fc_not_assigned.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.fc_not_assigned.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const newFormalCaregiver = await this.findAdmin(
      newFormalCaregiverId,
      loggedInAdmin.institution.id,
      ERole.FORMAL_CAREGIVER,
      ['roles'],
    );

    if (!newFormalCaregiver) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.fc_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.fc_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    senior.admins = senior.admins.map((admin) => {
      if (admin.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER)) {
        return newFormalCaregiver;
      }
      return admin;
    });

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}`;

    await this.userRepository.save(senior);
    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_SENIOR_ASSIGNED,
      ENotificationPriority.HIGH,
      [newFormalCaregiver],
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.success.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.EDIT_SENIORS_FORMAL_CAREGIVER.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async setUserStatus(seniorId: number, { status }: SetStatusDto, adminId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = adminId && (await this.adminService.findLoggedInAdmin(adminId, ['institution']));

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['status'],
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.not_found.notification.message`, {
          lang,
        }),
      );
    }

    if (user.status.status_name === EStatus.CREATED) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.unable_to_change_status.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.unable_to_change_status.notification.message`,
          {
            lang,
            args: { property: EStatus.CREATED },
          },
        ),
      );
    }

    const updatedStatus = await this.statusRepository.findOne({
      where: {
        status_name: status,
      },
    });

    if (!updatedStatus) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.status_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.status_not_found.notification.message`, {
          lang,
        }),
      );
    }

    if (user.status && user.status.id === updatedStatus.id) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.user_already_has_status.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.user_already_has_status.notification.message`,
          {
            lang,
            args: { property: status },
          },
        ),
      );
    }

    user.status = updatedStatus;
    await this.userRepository.update(seniorId, user);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_USER_STATUS.success.notification.message`, {
        lang,
      }),
    );
  }

  async uploadImage(image: Express.Multer.File, adminId: number, seniorId?: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId, ['institution', 'roles']);
    const isInformalCaregiver = loggedInAdmin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER);

    if (seniorId && isInformalCaregiver) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.cannot_upload.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.cannot_upload.notification.message`, {
          lang,
          args: { property: ERole.INFORMAL_CAREGIVER },
        }),
      );
    }

    const seniorToUpdate =
      seniorId &&
      (await this.userRepository.findOne({
        where: {
          id: seniorId,
        },
      }));

    if (seniorId && !seniorToUpdate) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const { bucketName, region } = this.configService.get('minio');
    const imageName = `${uuidv4()}.${image.originalname.split('.').pop()}`;
    const s3Client = this.minioClientService.getClient();

    try {
      await s3Client.headBucket({ Bucket: bucketName });
    } catch (err) {
      try {
        await s3Client.createBucket({
          Bucket: bucketName,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      } catch (createErr) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_create_bucket.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_create_bucket.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    const existingImageName = seniorToUpdate ? seniorToUpdate.image_name : loggedInAdmin.image_name;

    if (existingImageName) {
      try {
        await s3Client.deleteObject({
          Bucket: bucketName,
          Key: existingImageName,
        });
      } catch (deleteErr) {
        return createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_delete_image.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_delete_image.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    }

    try {
      await s3Client.putObject({
        Bucket: bucketName,
        Key: imageName,
        Body: image.buffer,
        ContentType: image.mimetype,
      });
    } catch (uploadErr) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_upload_image.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.failed_to_upload_image.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (seniorToUpdate) {
      seniorToUpdate.image_name = imageName;
      await this.userRepository.save(seniorToUpdate);
    } else {
      loggedInAdmin.image_name = imageName;
      await this.adminRepository.save(loggedInAdmin);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPLOAD_IMAGE.success.notification.message`, {
        lang,
      }),
    );
  }

  async getImage(userId: number, model: EntityTarget<Admin | User>): Promise<TResponse<string>> {
    const lang = I18nContext.current().lang;

    const repository = this.dataSource.getRepository(model);

    const admin = await repository.findOne({
      where: {
        id: userId,
      },
      select: ['image_name'],
    });

    if (!admin) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const image_name = admin?.image_name;
    const { bucketName } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();

    try {
      await s3Client.headObject({ Bucket: bucketName, Key: image_name });
    } catch (error) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.not_found.notification.message`, {
          lang,
        }),
      );
    }

    try {
      const data = await s3Client.getObject({ Bucket: bucketName, Key: image_name });
      const stream = data.Body as NodeJS.ReadableStream;

      return new Promise((resolve, reject) => {
        let buffer: Buffer = Buffer.from([]);

        stream.on('data', (chunk) => {
          buffer = Buffer.concat([buffer, chunk]);
        });

        stream.on('end', () => {
          const base64String = buffer.toString('base64');
          resolve(
            createResponse(
              HttpStatus.OK,
              base64String,
              this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.success.notification.title`, {
                lang,
              }),
              this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.success.notification.message`, {
                lang,
              }),
            ),
          );
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      return createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.error.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_IMAGE.error.notification.message`, {
          lang,
        }),
      );
    }
  }

  async deleteImage(adminId: number, seniorId?: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId, ['institution', 'roles']);
    const isInformalCaregiver = loggedInAdmin.roles.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER);

    if (seniorId && isInformalCaregiver) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.cannot_delete.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.cannot_delete.notification.message`, {
          lang,
          args: { property: ERole.INFORMAL_CAREGIVER },
        }),
      );
    }

    const seniorToUpdate =
      seniorId &&
      (await this.userRepository.findOne({
        where: {
          id: seniorId,
        },
      }));

    if (seniorId && !seniorToUpdate) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const existingImageName = seniorToUpdate ? seniorToUpdate.image_name : loggedInAdmin.image_name;

    if (!existingImageName) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.no_image.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.no_image.notification.message`, {
          lang,
        }),
      );
    }

    const { bucketName } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();

    try {
      await s3Client.deleteObject({ Bucket: bucketName, Key: existingImageName });
    } catch (err) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.error.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.error.notification.message`, {
          lang,
        }),
      );
    }

    if (seniorToUpdate) {
      seniorToUpdate.image_name = null;
      await this.userRepository.save(seniorToUpdate);
    } else {
      loggedInAdmin.image_name = null;
      await this.adminRepository.save(loggedInAdmin);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_IMAGE.success.notification.message`, {
        lang,
      }),
    );
  }

  async setMyPersonalSettings(
    { first_name, last_name, date_of_birth, phone_number, email_address, address }: SetMyPersonalSettingsDto,
    adminId: number,
  ): Promise<TResponse | TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = adminId && (await this.adminService.findLoggedInAdmin(adminId));

    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(adminId, Admin, [
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
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_MY_PERSONAL_SETTINGS.already_in_use.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.SET_MY_PERSONAL_SETTINGS.already_in_use.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    Object.assign(loggedInAdmin, {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      email_address,
    });

    await this.adminRepository.save(loggedInAdmin);

    const adminAddress = await this.addressRepository.findOne({
      where: {
        admin: {
          id: loggedInAdmin.id,
        },
      },
    });

    if (adminAddress) {
      Object.assign(adminAddress, address);
      await this.addressRepository.save(adminAddress);
    } else {
      const newAddress = this.addressRepository.create({
        ...address,
        admin: loggedInAdmin,
      });
      await this.addressRepository.save(newAddress);
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_MY_PERSONAL_SETTINGS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_MY_PERSONAL_SETTINGS.success.notification.message`, {
        lang,
      }),
    );
  }

  async setMyFirstName(first_name: string, adminId: number): Promise<TResponse | TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId);
    loggedInAdmin.first_name = first_name;
    await this.adminRepository.save(loggedInAdmin);
    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_MY_FIRST_NAME.updated.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.SET_MY_FIRST_NAME.updated.notification.message`, {
        lang,
      }),
    );
  }

  async updateAdminInstitutionContact(
    userId: number,
    { email_address, phone_number }: UpdateAdminContactDto,
    adminId?: number,
  ): Promise<TResponse | TResponse<Record<string, string[]>>> {
    const lang = I18nContext.current().lang;

    let adminToUpdate;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);
    adminToUpdate = loggedInAdmin;

    if (!loggedInAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.admin_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.admin_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    adminId &&
      (adminToUpdate = await this.adminRepository.findOne({
        where: {
          id: adminId,
          institution: {
            id: loggedInAdmin.institution.id,
          },
          roles: {
            role_name: ERole.ADMIN_INSTITUTION,
          },
        },
        relations: ['roles'],
      }));

    if (!adminToUpdate) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.admin_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.admin_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const targetId = adminId ?? userId;
    const nonUniqueProperties = await this.adminService.checkPropertyUniqueness(targetId, Admin, [
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
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.already_in_use.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.already_in_use.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    Object.assign(adminToUpdate, {
      email_address,
      phone_number,
    });

    await this.adminRepository.save(adminToUpdate);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_CONTACT.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async updateAdminInstitutionInfo(
    userId: number,
    updateAdminInfo: UpdateAdminInfoDto,
    adminId?: number,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    let adminToUpdate;
    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution']);

    if (!loggedInAdmin) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (adminId) {
      adminToUpdate = await this.adminRepository.findOne({
        where: {
          id: adminId,
          institution: {
            id: loggedInAdmin.institution.id,
          },
          roles: {
            role_name: ERole.ADMIN_INSTITUTION,
          },
        },
      });

      if (!adminToUpdate) {
        return createResponse(
          HttpStatus.NOT_FOUND,
          null,
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.not_found.notification.title`,
            {
              lang,
            },
          ),
          this.i18n.t(
            `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.not_found.notification.message`,
            {
              lang,
            },
          ),
        );
      }
    } else {
      adminToUpdate = loggedInAdmin;
    }

    Object.assign(adminToUpdate, {
      ...updateAdminInfo,
    });

    await this.adminRepository.save(adminToUpdate);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.success.notification.title`, {
        lang,
      }),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.UPDATE_ADMIN_INSTITUTION_INFO.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  getStepProperties(onboarding: Onboarding): string[] {
    return Object.keys(onboarding).filter((key) => key.startsWith('step') && onboarding[key] !== null);
  }

  async updateStep(onboarding: Onboarding, step: number): Promise<void> {
    const stepPropertyName = `step${step}`;
    onboarding[stepPropertyName] = true;
    await this.onboardingRepository.save(onboarding);
  }

  async updateOnboardingSteps(userId: number, step: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id: userId,
        },
      },
    });

    if (!onboarding) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.not_found.notification.message`, {
          lang,
        }),
      );
    }

    const stepProperties = this.getStepProperties(onboarding);
    const maxStep = stepProperties.length;

    if (step < 1 || step > maxStep) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.invalid_step_value.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.invalid_step_value.notification.message`,
          {
            lang,
            args: { property: maxStep },
          },
        ),
      );
    }

    const stepPropertyName = `step${step}`;

    if (onboarding[stepPropertyName]) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.already_completed.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.already_completed.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    await this.updateStep(onboarding, step);

    const allStepsCompleted = stepProperties.every((stepKey) => onboarding[stepKey]);

    if (allStepsCompleted) {
      await this.onboardingRepository.delete(onboarding.id);

      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.all_steps_completed.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.all_steps_completed.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.UPDATE_ONBOARDING_STEPS.success.notification.message`, {
        lang,
      }),
    );
  }

  async getOnboardingSteps(userId: number): Promise<TResponse<Onboarding>> {
    const lang = I18nContext.current().lang;

    const stepColumns = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
    const onboarding = await this.onboardingRepository
      .createQueryBuilder('onboarding')
      .select(stepColumns.map((step) => `onboarding.${step}`))
      .innerJoin('onboarding.admin', 'admin')
      .where('admin.id = :userId', { userId })
      .getOne();

    if (!onboarding) {
      return createResponse(HttpStatus.NO_CONTENT, null);
    }
    return createResponse(
      HttpStatus.OK,
      onboarding,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEPS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEPS.success.notification.message`, {
        lang,
      }),
    );
  }

  async getOnboardingStepStatus(userId: number, step: number): Promise<TResponse<{ [key: string]: boolean }>> {
    const lang = I18nContext.current().lang;

    const onboarding = await this.onboardingRepository.findOne({
      where: {
        admin: {
          id: userId,
        },
      },
    });

    if (!onboarding) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const stepProperties = Object.keys(onboarding).filter((key) => key.startsWith('step') && onboarding[key] !== null);
    const maxStep = stepProperties.length;

    if (step < 1 || step > maxStep) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.invalid_step_value.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.invalid_step_value.notification.message`,
          {
            lang,
            args: { property: maxStep },
          },
        ),
      );
    }

    const stepValue = !!onboarding[`step${step}`];
    const response = { [`step${step}`]: stepValue };

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.GET_ONBOARDING_STEP_STATUS.success.notification.message`, {
        lang,
      }),
    );
  }

  async assignInformalCaregiverToSenior(userId: number, caregiverId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution', 'roles']);
    const caregiver = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles', 'users'],
    });

    const informalCaregiverRole = await this.roleRepository.findOne({
      where: {
        role_name: ERole.INFORMAL_CAREGIVER,
      },
    });

    const isInformalCaregiver = caregiver?.roles.some((role) => role.id === informalCaregiverRole.id);

    if (!caregiver || !isInformalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.caregiver_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.caregiver_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const seniorAlreadyAssigned = caregiver.users.some((user) => user.id === +seniorId);

    if (seniorAlreadyAssigned) {
      return createResponse(
        HttpStatus.CONFLICT,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.already_assigned.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.already_assigned.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['admins', 'admins.roles'],
    });

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.senior_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.senior_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const informalCaregiverAssigned = senior.admins.some((admin) =>
      admin.roles.some((role) => role.id === informalCaregiverRole.id),
    );

    if (informalCaregiverAssigned) {
      return createResponse(
        HttpStatus.CONFLICT,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.senior_already_has_ic.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.senior_already_has_ic.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    senior.admins.push(caregiver);

    await this.userRepository.save(senior);

    const adminsAssignedToUser = senior.admins
      .filter((assignedAdmin) => assignedAdmin.id !== userId && assignedAdmin.id !== +caregiverId)
      .map((el) => ({
        id: el.id,
        email_address: el.email_address,
      }));

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=&${seniorId}&name=Supporting+Contacts`;

    await this.notificationService.sendNotification(
      seniorId,
      ENotificationTitle.NEW_INFORMAL_CAREGIVER_ASSIGNED,
      ENotificationPriority.HIGH,
      adminsAssignedToUser,
      senior.first_name + ' ' + senior.last_name,
      link,
    );

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.ASSIGN_INFORMAL_CAREGIVER_TO_SENIOR.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }
  async revokeInformalCaregiverFromSenior(adminId: number, caregiverId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId, ['institution', 'roles']);

    const ic = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles', 'users'],
    });
    const userAssignedToIc = ic?.users?.some((user) => user.id === +seniorId);
    if (!ic || !userAssignedToIc) {
      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REVOKE_INFORMAL_CAREGIVER_FROM_SENIOR.not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REVOKE_INFORMAL_CAREGIVER_FROM_SENIOR.not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const remainingUsers = ic.users.filter((user) => user.id !== +seniorId);
    ic.users = remainingUsers;
    await this.adminRepository.save(ic);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.REVOKE_INFORMAL_CAREGIVER_FROM_SENIOR.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.REVOKE_INFORMAL_CAREGIVER_FROM_SENIOR.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async deleteUser(adminId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId, ['institution', 'roles']);
    const userToDelete = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['user_additional_info.documents', 'notes.attachments'],
    });

    if (!userToDelete) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_USER.not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_USER.not_found.notification.message`, {
          lang,
        }),
      );
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

    await this.userRepository.remove(userToDelete);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_USER.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TAdminInstitutionResponseKey}.service.DELETE_USER.success.notification.message`, {
        lang,
      }),
    );
  }

  async assignFormalCaregiverToSenior(userId: number, caregiverId: number, seniorId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(userId, ['institution', 'roles']);
    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['admins', 'admins.roles'],
    });

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const assignedFormalCaregiver = senior?.admins?.find(
      (caregiver) =>
        caregiver.id === +caregiverId && caregiver?.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER),
    );

    if (assignedFormalCaregiver) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.already_assigned.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.already_assigned.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const formalCaregiverToAssign = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles'],
    });

    const isFormalCaregiver = formalCaregiverToAssign?.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (!formalCaregiverToAssign || !isFormalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.caregiver_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.caregiver_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    senior?.admins.push(formalCaregiverToAssign);

    await this.userRepository.save(senior);

    const informalCaregiver = senior?.admins?.find((caregiver) =>
      caregiver?.roles?.some((role) => role.role_name === ERole.INFORMAL_CAREGIVER),
    );

    const link = this.configService.get('domain') + `/seniors/senior-profile?id=${seniorId}&name=Formal+Caregivers`;

    if (informalCaregiver) {
      await this.notificationService.sendNotification(
        seniorId,
        ENotificationTitle.NEW_FORMAL_CAREGIVER_ASSIGNED,
        ENotificationPriority.HIGH,
        [informalCaregiver],
        senior.first_name + ' ' + senior.last_name,
        link,
      );
    }

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.ASSIGN_FORMAL_CAREGIVER_TO_SENIOR.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }

  async updateFormalCaregiverRole(adminId: number, caregiverId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const loggedInAdmin = await this.adminService.findLoggedInAdmin(adminId, ['institution']);

    const caregiverToUpdate = await this.adminRepository.findOne({
      where: {
        id: caregiverId,
        institution: {
          id: loggedInAdmin.institution.id,
        },
      },
      relations: ['roles', 'institution'],
    });

    const isFormalCaregiver = caregiverToUpdate?.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (!caregiverToUpdate || !isFormalCaregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.fc_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.fc_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const adminInstitutionRole = await this.roleRepository.findOne({
      where: {
        role_name: ERole.ADMIN_INSTITUTION,
      },
    });

    if (!adminInstitutionRole) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const hasAdminInstitutionRole = caregiverToUpdate.roles.some((role) => role.role_name === ERole.ADMIN_INSTITUTION);

    if (hasAdminInstitutionRole) {
      caregiverToUpdate.roles = caregiverToUpdate.roles.filter((role) => role.role_name !== ERole.ADMIN_INSTITUTION);

      await this.adminRepository.save(caregiverToUpdate);

      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_removed.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_removed.notification.message`,
          {
            lang,
            args: { property: ERole.ADMIN_INSTITUTION },
          },
        ),
      );
    } else {
      caregiverToUpdate.roles.push(adminInstitutionRole);

      await this.adminRepository.save(caregiverToUpdate);

      return createResponse(
        HttpStatus.OK,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_added.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.UPDATE_FORMAL_CAREIVER_ROLE.role_added.notification.message`,
          {
            lang,
            args: { property: ERole.ADMIN_INSTITUTION },
          },
        ),
      );
    }
  }
  async removeFormalCaregiverSeniorAssignment(
    caregiverId: number,
    seniorId: number,
    userId: number,
  ): Promise<TResponse> {
    const lang = I18nContext.current().lang;

    const [caregiver, senior, loggedInAdmin] = await Promise.all([
      this.adminRepository.findOne({
        where: { id: caregiverId },
        relations: ['roles', 'institution', 'users'],
      }),
      this.userRepository.findOne({
        where: { id: seniorId },
        relations: ['admins.roles', 'institution'],
      }),
      this.adminRepository.findOne({
        where: { id: userId },
        relations: ['institution'],
      }),
    ]);

    if (!caregiver) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.caregiver_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.caregiver_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.senior_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.senior_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (!loggedInAdmin) {
      return createResponse(
        HttpStatus.UNAUTHORIZED,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.logged_in_admin_not_found.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.logged_in_admin_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const hasFormalCaregiverRole = caregiver.roles.some((role) => role.role_name === ERole.FORMAL_CAREGIVER);

    if (!hasFormalCaregiverRole) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.not_fc.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.not_fc.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    if (
      caregiver.institution.id !== senior.institution.id ||
      caregiver.institution.id !== loggedInAdmin.institution.id
    ) {
      return createResponse(
        HttpStatus.FORBIDDEN,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.not_same_institution.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.not_same_institution.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const userAssignment = caregiver.users.find((user) => user.id === seniorId);

    if (!userAssignment) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.caregiver_not_assigned_to_senior.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.caregiver_not_assigned_to_senior.notification.message`,
          {
            lang,
          },
        ),
      );
    }
    const onlyOneFormalCaregiver =
      senior.admins.filter(
        (admin) => admin.id !== caregiverId && admin.roles?.some((role) => role.role_name === ERole.FORMAL_CAREGIVER),
      ).length === 0;
    if (onlyOneFormalCaregiver) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.cannot_remove.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.cannot_remove.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    caregiver.users = caregiver.users.filter((user) => user.id !== seniorId);
    await this.adminRepository.save(caregiver);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.success.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TAdminInstitutionResponseKey}.service.REMOVE_FORMAL_CAREGIVER_SENIOR_ASSIGNMENT.success.notification.message`,
        {
          lang,
        },
      ),
    );
  }
}
