import dayjs, { type Dayjs } from 'dayjs';
import { isNumber } from 'lodash';
import { z } from 'zod';
import { type UploadFile } from 'antd';
import { PersonalGrowth } from '@ProcarefulAdmin/constants';
import {
  AddNoteDtoCategoryItem,
  DayDtoName,
  UpdateCaregiverRoleDtoRoleNameItem,
  AddSocialAbilitiesDtoEnoughPeopleFeelClose,
  AddSocialAbilitiesDtoExperienceOfEmptiness,
  AddSocialAbilitiesDtoFeelRejected,
  AddSocialAbilitiesDtoMissHavingPeopleAround,
  AddSocialAbilitiesDtoRelyOnPeople,
  AddSocialAbilitiesDtoTrustCompletely,
  AddQualityOfLifeDtoAnxietyDepression,
  AddQualityOfLifeDtoPainDiscomfort,
  AddQualityOfLifeDtoUsualActivities,
  AddQualityOfLifeDtoSelfCare,
  AddQualityOfLifeDtoMobility,
  AddQualityOfLifeDtoMotivation,
  AddSleepAssessmentDtoCannotSleepWithin30Minutes,
  AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning,
  AddSleepAssessmentDtoNeedToUseBathroom,
  AddSleepAssessmentDtoCannotBreatheComfortably,
  AddSleepAssessmentDtoFeelTooCold,
  AddSleepAssessmentDtoFeelTooHot,
  AddSleepAssessmentDtoHadBadDreams,
  AddSleepAssessmentDtoHavePain,
  AddSleepAssessmentDtoCoughOrSnoreLoudly,
  AddSleepAssessmentDtoSleepingTroubleFrequency,
  AddSleepAssessmentDtoSleepQualityRating,
  AddSleepAssessmentDtoMedicineForSleep,
  AddSleepAssessmentDtoTroubleStayingAwakeFrequency,
  AddSleepAssessmentDtoEnthusiasmToGetThingsDone,
  AddSleepAssessmentDtoHaveBedPartnerOrRoomMate,
  AddSleepAssessmentDtoLoudSnoring,
  AddSleepAssessmentDtoBreathingPause,
  AddSleepAssessmentDtoLegsTwitching,
  AddSleepAssessmentDtoSleepDisorientation,
  AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate,
  AddSleepAssessmentDtoFeelTooColdRoomMate,
  AddSleepAssessmentDtoFeelTooHotRoomMate,
  AddSleepAssessmentDtoHadBadDreamsRoomMate,
  AddSleepAssessmentDtoHavePainRoomMate,
  AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate,
  AddSupportingContactDtoRelationItem,
  AddGameScoreDtoGameName,
  ScheduleNoLimitationsDtoUserWalkingExercises,
  ScheduleNoLimitationsDtoBreathingLevel,
  ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoPhysicalLevel,
  ScheduleNoLimitationsDtoUserBreathingExercisesItem,
  ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem,
  ScheduleMobilityLimitationsDtoPhysicalLevel,
  ScheduleMobilityLimitationsDtoBreathingLevel,
  ScheduleMobilityLimitationsDtoUserBreathingExercisesItem,
  ScheduleBedriddenDtoUserBreathingExercisesItem,
  ScheduleBedriddenDtoUserPhysicalExercisesItem,
  ScheduleBedriddenDtoPhysicalLevel,
  ScheduleBedriddenDtoBreathingLevel,
  EditCarePlanReasonDtoEditCarePlanReason,
  ScheduleNoLimitationsDtoPersonalGrowth,
  ScheduleMobilityLimitationsDtoPersonalGrowth,
  ScheduleBedriddenDtoPersonalGrowth,
  UpdateInstitutionAdminRoleDtoRoleToAssign,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import {
  alphanumericSpecialCharsRegex,
  confirmationCodeSchema,
  emailSchema,
  optionalEmailSchema,
  optionalPhoneNumberSchema,
  phoneSchema,
} from '@Procareful/common/lib/utils';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&!#"$%&'()*+,-./:;<=>?@[\\\]^_`{|}])[A-Za-z\d@$!%*?&!#"$%&'()*+,-./:;<=>?@[\\\]^_`{|}]{8,}$/;

type WorkingHoursData = {
  phoneNumber?: string;
  emailAddress?: string;
  workingDays?: string[];
} & {
  [key in DayDtoName]?: Dayjs[] | null;
};

const optionalStringSchema = z.string().optional().or(z.literal(''));

export const loginSchema = z.object({
  get email() {
    return emailSchema.shape.email;
  },
  get password() {
    return z.string().min(1, { message: i18n.t('admin_alert_password_required') });
  },
});

export const registerSchema = z
  .object({
    get email() {
      return emailSchema.shape.email;
    },
    get password() {
      return z.string().regex(passwordRegex, {
        message: i18n.t('admin_alert_password_hint'),
      });
    },
    get confirmPassword() {
      return z.string().min(1, { message: i18n.t('admin_alert_confirm_password_required') });
    },
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    get message() {
      return i18n.t('admin_alert_passwords_must_match');
    },
    path: ['confirmPassword'],
  });

export const registerPhoneSchema = z.object({
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
});

export const registerPasswordSchema = z
  .object({
    get password() {
      return z.string().regex(passwordRegex, {
        message: i18n.t('admin_alert_password_hint'),
      });
    },
    get confirmPassword() {
      return z.string().min(1, { message: i18n.t('admin_alert_confirm_password_required') });
    },
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    get message() {
      return i18n.t('admin_alert_passwords_must_match');
    },
    path: ['confirmPassword'],
  });

export const loginConfirmationSchema = z.object({
  get code() {
    return confirmationCodeSchema.shape.code;
  },
  rememberMe: z.boolean(),
});

export const addNoteFormSchema = z.object({
  get title() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_form_error_no_empty') })
      .max(50, { message: i18n.t('admin_form_error_too_much_chars', { count: 50 }) })
      .regex(alphanumericSpecialCharsRegex, {
        message: i18n.t('admin_form_error_title'),
      })
      .default('');
  },
  get category() {
    return z
      .array(
        z.nativeEnum(AddNoteDtoCategoryItem, {
          errorMap: () => ({ message: i18n.t('admin_form_error_not_selected') }),
        })
      )
      .optional();
  },
  get note() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_form_error_no_empty') })
      .max(1000, { message: i18n.t('admin_form_error_too_much_chars', { count: 1000 }) })
      .regex(alphanumericSpecialCharsRegex, {
        message: i18n.t('admin_form_error_note'),
      })
      .default('');
  },
  priority: z.boolean().default(false),
});

const dateOfBirthSchema = z.custom<dayjs.Dayjs | undefined>(
  value =>
    !value ||
    (dayjs.isDayjs(value) &&
      value.isAfter(dayjs().subtract(150, 'years')) &&
      value.isBefore(dayjs().subtract(55, 'years'))),
  {
    message: i18n.t('admin_alert_date_of_birth_range'),
  }
);

const dateOfBirthSchemaWithoutRange = z.custom<dayjs.Dayjs | undefined>(
  value => !value || dayjs.isDayjs(value)
);

export const basicInfoSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get dateOfBirth() {
    return dateOfBirthSchema.optional();
  },
});

const addressSchema = z.object({
  city: optionalStringSchema,
  street: optionalStringSchema,
  building: optionalStringSchema,
  flat: optionalStringSchema,
  zipCode: optionalStringSchema,
});

export const userContactSchema = addressSchema.extend({
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber.default('');
  },
  get emailAddress() {
    return emailSchema.shape.email.default('');
  },
  additionalInfo: z.string().optional().or(z.literal('')),
});

export const seniorContactSchema = userContactSchema.extend({
  get emailAddress() {
    return optionalEmailSchema;
  },
});

export const addSeniorSchema = basicInfoSchema.merge(userContactSchema);

export const addSuperAdminSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get emailAddress() {
    return emailSchema.shape.email.default('');
  },
  get phoneNumber() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_form_error_no_empty') })
      .default('');
  },
  get institutionName() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_form_error_no_empty') })
      .default('');
  },
});

export const institutionDetailsSchema = z.object({
  get name() {
    return z
      .string()
      .max(100, { message: i18n.t('admin_alert_institution_name_maximal_characters') })
      .refine(value => value === undefined || value.length === 0 || value.length >= 5, {
        message: i18n.t('admin_alert_institution_name_minimal_characters'),
      })
      .optional();
  },
  get phoneNumber() {
    return optionalPhoneNumberSchema;
  },
  get emailAddress() {
    return optionalEmailSchema;
  },
  get city() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_city_required') })
      .optional()
      .or(z.literal(''));
  },
  get street() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_street_required') })
      .optional()
      .or(z.literal(''));
  },
  get building() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_building_required') })
      .optional()
      .or(z.literal(''));
  },
  get flat() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_flat_required') })
      .optional()
      .or(z.literal(''));
  },
  get zipCode() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_zip_code_required') })
      .optional()
      .or(z.literal(''));
  },
});

export const headAdminInstitutionDetailsSchema = userContactSchema.extend({
  get name() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_name_required') })
      .default('');
  },
  city: z.string().optional(),
});

const workingHoursSchema = z.optional(
  z
    .array(
      z.custom<dayjs.Dayjs>(
        value => value instanceof dayjs,
        i18n.t('admin_form_error_working_hours_empty')
      )
    )
    .min(2, { message: i18n.t('admin_form_error_working_hours_empty') })
    .nullable()
);

export const supportManagementSchema = z
  .object({
    get phoneNumber() {
      return optionalPhoneNumberSchema;
    },
    get emailAddress() {
      return optionalEmailSchema;
    },
    workingDays: z.array(z.string()).optional(),
    [DayDtoName.Monday]: workingHoursSchema,
    [DayDtoName.Tuesday]: workingHoursSchema,
    [DayDtoName.Wednesday]: workingHoursSchema,
    [DayDtoName.Thursday]: workingHoursSchema,
    [DayDtoName.Friday]: workingHoursSchema,
    [DayDtoName.Saturday]: workingHoursSchema,
    [DayDtoName.Sunday]: workingHoursSchema,
  })
  .superRefine((data: WorkingHoursData, ctx) => {
    if (data.workingDays && data.workingDays.length > 0) {
      data.workingDays.forEach(day => {
        const dayKey = day as DayDtoName;
        if (!data[dayKey] || data[dayKey]?.length === 0) {
          ctx.addIssue({
            path: [dayKey],
            message: i18n.t('admin_alert_working_hours_must_be_provided'),
            code: z.ZodIssueCode.custom,
          });
        }
      });
    }
  });

export const addCaregiverSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber.default('');
  },
  get emailAddress() {
    return emailSchema.shape.email.default('');
  },
  city: optionalStringSchema,
  street: optionalStringSchema,
  building: optionalStringSchema,
  flat: optionalStringSchema,
  zipCode: optionalStringSchema,
});

export const updatePersonalInfoSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber.default('');
  },
  get emailAddress() {
    return emailSchema.shape.email.default('');
  },
  city: optionalStringSchema,
  street: optionalStringSchema,
  building: optionalStringSchema,
  flat: optionalStringSchema,
  zipCode: optionalStringSchema,
  get dateOfBirth() {
    return dateOfBirthSchemaWithoutRange;
  },
});

export const basicInfoFormalCaregiverSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
});

export const roleSchema = z.object({
  position: z.array(z.nativeEnum(UpdateCaregiverRoleDtoRoleNameItem)).default([]),
});

export const addInstitutionAdminSchema = z.object({
  get firstName() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_first_name_required') })
      .default('');
  },
  get lastName() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_last_name_required') })
      .default('');
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
  get emailAddress() {
    return emailSchema.shape.email;
  },
});

export const editInstitutionAdminSchema = addInstitutionAdminSchema.omit({
  firstName: true,
  lastName: true,
});

export const resetPasswordSchema = z
  .object({
    get password() {
      return z.string().regex(passwordRegex, {
        message: i18n.t('admin_alert_password_hint'),
      });
    },
    get confirmPassword() {
      return z.string().min(1, { message: i18n.t('admin_alert_confirm_password_required') });
    },
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: i18n.t('admin_alert_passwords_reset_must_match'),
    path: ['confirmPassword'],
  });

export const editSuperAdminInstitutionSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get emailAddress() {
    return emailSchema.shape.email;
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
  status: z.string().optional(),
});

export const changeInstitutionOwnerSchema = z.object({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get emailAddress() {
    return emailSchema.shape.email;
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
  get institutionName() {
    return z
      .string()
      .min(1, { message: i18n.t('admin_alert_institution_name_required') })
      .min(5, { message: i18n.t('admin_alert_institution_name_minimal_characters') })
      .max(50, { message: i18n.t('admin_alert_institution_name_maximal_characters') });
  },
});

export const seniorBasicInfoSchema = basicInfoSchema
  .extend({
    get dateOfBirth() {
      return dateOfBirthSchema.refine(
        (value): value is dayjs.Dayjs =>
          !!value &&
          dayjs.isDayjs(value) &&
          value.isAfter(dayjs().subtract(150, 'years')) &&
          value.isBefore(dayjs().subtract(55, 'years')),
        {
          message: i18n.t('admin_alert_date_of_birth_required'),
        }
      );
    },
    get phoneNumber() {
      return phoneSchema.shape.phoneNumber;
    },
    get emailAddress() {
      return z
        .string()
        .email({ message: i18n.t('shared_alert_email_invalid') })
        .optional()
        .or(z.literal(''));
    },
  })
  .extend({
    additionalInfo: z.string().optional().or(z.literal('')),
    avatar: z.instanceof(File).optional(),
  })
  .extend(addressSchema.shape);

export const familyDoctorSchema = addressSchema.extend({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
  get emailAddress() {
    return z
      .string()
      .email({ message: i18n.t('shared_alert_email_invalid') })
      .optional()
      .or(z.literal(''));
  },
});

export const cognitiveAbilitiesSchema = z.object({
  get mocaScoring() {
    return z.coerce
      .number({
        required_error: i18n.t('admin_form_error_no_empty'),
        invalid_type_error: i18n.t('admin_form_error_no_empty'),
      })
      .min(18, { message: i18n.t('admin_form_moca_score_min') })
      .max(30, { message: i18n.t('admin_form_moca_score_max') });
  },
});

export const physicalAbilitiesSchema = z.object({
  get currentlyBedridden() {
    return z.boolean({
      required_error: i18n.t('admin_form_error_select_an_option'),
    });
  },
  get canWalkWithoutSupport() {
    return z.boolean({
      required_error: i18n.t('admin_form_error_select_an_option'),
    });
  },
  get severeBalanceProblems() {
    return z.boolean({
      required_error: i18n.t('admin_form_error_select_an_option'),
    });
  },
});

const vigorousActivitySchema = z
  .object({
    get vigorousActivityDaysLastWeek() {
      return z.union([z.number({ required_error: i18n.t('admin_form_error_no_empty') }), z.nan()]);
    },
    get vigorousActivityMinutesPerDay() {
      return z.coerce
        .number()
        .max(720, i18n.t('admin_form_max_minutes_duration', { count: 720 }))
        .optional();
    },
    vigorousActivityMinutesPerDayNotSure: z.boolean().optional(),
  })
  .refine(
    data => {
      if (data.vigorousActivityDaysLastWeek === 0) {
        return true;
      }

      return (
        data.vigorousActivityMinutesPerDayNotSure ||
        data.vigorousActivityMinutesPerDay !== undefined
      );
    },
    {
      path: ['vigorousActivityMinutesPerDay'],
      message: i18n.t('admin_form_error_no_empty'),
    }
  );

const moderateActivitySchema = z
  .object({
    get moderateActivityDaysLastWeek() {
      return z.union([z.number({ required_error: i18n.t('admin_form_error_no_empty') }), z.nan()]);
    },
    get moderateActivityMinutesPerDay() {
      return z.coerce
        .number()
        .max(720, i18n.t('admin_form_max_minutes_duration', { count: 720 }))
        .optional();
    },
    moderateActivityMinutesPerDayNotSure: z.boolean().optional(),
  })
  .refine(
    data => {
      if (data.moderateActivityDaysLastWeek === 0) {
        return true;
      }

      return (
        data.moderateActivityMinutesPerDayNotSure ||
        data.moderateActivityMinutesPerDay !== undefined
      );
    },
    {
      path: ['moderateActivityMinutesPerDay'],
      message: i18n.t('admin_form_error_no_empty'),
    }
  );

const walkingActivitySchema = z
  .object({
    get walkingDaysLastWeek() {
      return z.union([z.number({ required_error: i18n.t('admin_form_error_no_empty') }), z.nan()]);
    },
    get walkingMinutesPerDay() {
      return z.coerce
        .number()
        .max(720, i18n.t('admin_form_max_minutes_duration', { count: 720 }))
        .optional();
    },
    walkingMinutesPerDayNotSure: z.boolean().optional(),
  })
  .refine(
    data => {
      if (data.walkingDaysLastWeek === 0) {
        return true;
      }

      return data.walkingMinutesPerDayNotSure || data.walkingMinutesPerDay !== undefined;
    },
    {
      path: ['walkingMinutesPerDay'],
      message: i18n.t('admin_form_error_no_empty'),
    }
  );

const sittingActivitySchema = z
  .object({
    get timeSittingLastWeek() {
      return z.coerce
        .number()
        .max(720, i18n.t('admin_form_max_minutes_duration', { count: 720 }))
        .optional();
    },
    timeSittingLastWeekNotSure: z.boolean().optional(),
  })
  .refine(data => data.timeSittingLastWeekNotSure || data.timeSittingLastWeek, {
    path: ['timeSittingLastWeek'],
    message: i18n.t('admin_form_error_no_empty'),
  });

export const physicalAbilitiesNoIssuesSchema = z.intersection(
  vigorousActivitySchema,
  z.intersection(
    moderateActivitySchema,
    z.intersection(walkingActivitySchema, sittingActivitySchema)
  )
);

export const socialAbilitiesSchema = z.object({
  get experienceOfEmptiness() {
    return z.nativeEnum(AddSocialAbilitiesDtoExperienceOfEmptiness, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get missHavingPeopleAround() {
    return z.nativeEnum(AddSocialAbilitiesDtoMissHavingPeopleAround, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get feelRejected() {
    return z.nativeEnum(AddSocialAbilitiesDtoFeelRejected, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get relyOnPeople() {
    return z.nativeEnum(AddSocialAbilitiesDtoRelyOnPeople, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get trustCompletely() {
    return z.nativeEnum(AddSocialAbilitiesDtoTrustCompletely, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get enoughPeopleFeelClose() {
    return z.nativeEnum(AddSocialAbilitiesDtoEnoughPeopleFeelClose, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
});

export const qualityOfLifeSchema = z
  .object({
    get motivation() {
      return z.nativeEnum(AddQualityOfLifeDtoMotivation, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get mobility() {
      return z.nativeEnum(AddQualityOfLifeDtoMobility, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get selfCare() {
      return z.nativeEnum(AddQualityOfLifeDtoSelfCare, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get usualActivities() {
      return z.nativeEnum(AddQualityOfLifeDtoUsualActivities, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get painDiscomfort() {
      return z.nativeEnum(AddQualityOfLifeDtoPainDiscomfort, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get anxietyDepression() {
      return z.nativeEnum(AddQualityOfLifeDtoAnxietyDepression, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get generalHealth() {
      return z.coerce
        .number({
          required_error: i18n.t('admin_form_error_no_empty'),
          invalid_type_error: i18n.t('admin_form_error_no_empty'),
        })
        .min(0, i18n.t('admin_form_error_no_empty'))
        .max(100, { message: i18n.t('admin_form_senior_health_max') })
        .refine(value => value !== undefined && value !== null, {
          message: i18n.t('admin_form_error_no_empty'),
        });
    },
  })
  .superRefine(({ generalHealth }, context) => {
    if (!isNumber(generalHealth)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('admin_form_error_no_empty'),
        path: ['generalHeal'],
      });
    }
  });

export const sleepSchema = z.object({
  get bedTime() {
    return z.custom<dayjs.Dayjs>(
      value => value instanceof dayjs,
      i18n.t('admin_form_error_no_empty')
    );
  },
  get fallAsleepDuration() {
    return z.coerce
      .number({
        required_error: i18n.t('admin_form_error_no_empty'),
        invalid_type_error: i18n.t('admin_form_error_no_empty'),
      })
      .max(480, { message: i18n.t('admin_form_max_minutes_duration', { count: 480 }) });
  },

  get wakeUpTime() {
    return z.custom<dayjs.Dayjs>(
      value => value instanceof dayjs,
      i18n.t('admin_form_error_no_empty')
    );
  },
  get actualSleepHours() {
    return z.coerce
      .number({
        required_error: i18n.t('admin_form_error_no_empty'),
        invalid_type_error: i18n.t('admin_form_error_no_empty'),
      })
      .max(24, { message: i18n.t('admin_form_actual_sleep_hours_max') });
  },
  get cannotSleepWithin30Minutes() {
    return z.nativeEnum(AddSleepAssessmentDtoCannotSleepWithin30Minutes, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get wakeUpMidnightOrEarlyMorning() {
    return z.nativeEnum(AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get needToUseBathroom() {
    return z.nativeEnum(AddSleepAssessmentDtoNeedToUseBathroom, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get cannotBreatheComfortably() {
    return z.nativeEnum(AddSleepAssessmentDtoCannotBreatheComfortably, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get feelTooCold() {
    return z.nativeEnum(AddSleepAssessmentDtoFeelTooCold, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get feelTooHot() {
    return z.nativeEnum(AddSleepAssessmentDtoFeelTooHot, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get hadBadDreams() {
    return z.nativeEnum(AddSleepAssessmentDtoHadBadDreams, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get havePain() {
    return z.nativeEnum(AddSleepAssessmentDtoHavePain, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get coughOrSnoreLoudly() {
    return z.nativeEnum(AddSleepAssessmentDtoCoughOrSnoreLoudly, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get sleepQualityRating() {
    return z.nativeEnum(AddSleepAssessmentDtoSleepQualityRating, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get medicineForSleep() {
    return z.nativeEnum(AddSleepAssessmentDtoMedicineForSleep, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get troubleStayingAwakeFrequency() {
    return z.nativeEnum(AddSleepAssessmentDtoTroubleStayingAwakeFrequency, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
  get enthusiasmToGetThingsDone() {
    return z.nativeEnum(AddSleepAssessmentDtoEnthusiasmToGetThingsDone, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_no_empty'),
      }),
    });
  },
});

const otherReasonsSchema = z
  .object({
    otherReasonsForTroubleSleeping: z.string().optional(),
    get sleepingTroubleFrequency() {
      return z
        .nativeEnum(AddSleepAssessmentDtoSleepingTroubleFrequency, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
  })
  .superRefine(({ sleepingTroubleFrequency, otherReasonsForTroubleSleeping }, context) => {
    if (
      otherReasonsForTroubleSleeping &&
      otherReasonsForTroubleSleeping.length > 0 &&
      !sleepingTroubleFrequency
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('admin_form_error_no_empty'),
        path: ['sleepingTroubleFrequency'],
      });
    }
  });

const troubleSleepingPartnerSchema = z
  .object({
    get haveBedPartnerOrRoomMate() {
      return z.nativeEnum(AddSleepAssessmentDtoHaveBedPartnerOrRoomMate, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      });
    },
    get loudSnoring() {
      return z
        .nativeEnum(AddSleepAssessmentDtoLoudSnoring, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get breathingPause() {
      return z
        .nativeEnum(AddSleepAssessmentDtoBreathingPause, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get legsTwitching() {
      return z
        .nativeEnum(AddSleepAssessmentDtoLegsTwitching, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get sleepDisorientation() {
      return z
        .nativeEnum(AddSleepAssessmentDtoSleepDisorientation, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get coughOrSnoreLoudlyRoomMate() {
      return z
        .nativeEnum(AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get feelTooColdRoomMate() {
      return z
        .nativeEnum(AddSleepAssessmentDtoFeelTooColdRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get feelTooHotRoomMate() {
      return z
        .nativeEnum(AddSleepAssessmentDtoFeelTooHotRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get hadBadDreamsRoomMate() {
      return z
        .nativeEnum(AddSleepAssessmentDtoHadBadDreamsRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get havePainRoomMate() {
      return z
        .nativeEnum(AddSleepAssessmentDtoHavePainRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
    get otherRestlessness() {
      return z.string().optional();
    },
    get otherRestlessnessFrequency() {
      return z
        .nativeEnum(AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        })
        .optional();
    },
  })
  .superRefine((data, context) => {
    if (!data.haveBedPartnerOrRoomMate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('admin_form_error_no_empty'),
        path: ['haveBedPartnerOrRoomMate'],
      });

      return;
    }

    const relatedFields: Array<keyof typeof data> = [
      'loudSnoring',
      'breathingPause',
      'legsTwitching',
      'sleepDisorientation',
      'coughOrSnoreLoudlyRoomMate',
      'feelTooColdRoomMate',
      'feelTooHotRoomMate',
      'hadBadDreamsRoomMate',
      'havePainRoomMate',
    ];

    if (
      data.haveBedPartnerOrRoomMate !==
        AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.no_partner_or_roommate ||
      !data.haveBedPartnerOrRoomMate
    ) {
      const noValueFields = relatedFields.filter(field => !data[field]);

      noValueFields.forEach(field => {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('admin_form_error_no_empty'),
          path: [field],
        });
      });
    }

    if (data.otherRestlessness && !data.otherRestlessnessFrequency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('admin_form_error_no_empty'),
        path: ['otherRestlessnessFrequency'],
      });
    }
  });

export const sleepAssessmentSchema = z.intersection(
  z.intersection(sleepSchema, troubleSleepingPartnerSchema),
  otherReasonsSchema
);

export const additionalInfoSchema = z.object({
  notes: z.string().optional().or(z.literal('')),
  files: z.array(z.custom<UploadFile>()).optional(),
});

const relationshipToSeniorSchema = z
  .object({
    get relation() {
      return z
        .array(
          z.nativeEnum(AddSupportingContactDtoRelationItem, {
            errorMap: () => ({
              message: i18n.t('admin_form_error_no_empty'),
            }),
          })
        )
        .min(1, { message: i18n.t('admin_form_error_no_empty') });
    },
    get emailAddress() {
      return z
        .string()
        .email({ message: i18n.t('shared_alert_email_invalid') })
        .optional()
        .or(z.literal(''));
    },
  })
  .superRefine(({ relation, emailAddress }, context) => {
    if (relation.includes(AddSupportingContactDtoRelationItem.informalCaregiver) && !emailAddress) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('shared_alert_email_required'),
        path: ['emailAddress'],
      });
    }
  });

export const addSupportingContactsBaseSchema = addressSchema.extend({
  get firstName() {
    return z.string().min(1, { message: i18n.t('admin_alert_first_name_required') });
  },
  get lastName() {
    return z.string().min(1, { message: i18n.t('admin_alert_last_name_required') });
  },
  get phoneNumber() {
    return phoneSchema.shape.phoneNumber;
  },
  addressSameAsSenior: z.boolean().optional(),
});

export const addSupportingContactsSchema = z.intersection(
  addSupportingContactsBaseSchema,
  relationshipToSeniorSchema
);

export const customScheduleWithLimitationsSchema = z.object({
  get physicalExercisesLowerBody() {
    return z
      .array(
        z.nativeEnum(ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get physicalExercisesUpperBody() {
    return z
      .array(
        z.nativeEnum(ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get physicalExercisesBalanceAndCoordination() {
    return z
      .array(
        z.nativeEnum(ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get physicalExercisesLevel() {
    return z.nativeEnum(ScheduleMobilityLimitationsDtoPhysicalLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get personalGrowthChallenges() {
    return z.union([
      z.nativeEnum(ScheduleMobilityLimitationsDtoPersonalGrowth).optional(),
      z.nativeEnum(PersonalGrowth).optional(),
    ]);
  },
  get breathingExercises() {
    return z
      .array(
        z.nativeEnum(ScheduleMobilityLimitationsDtoUserBreathingExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get breathingExercisesLevel() {
    return z.nativeEnum(ScheduleMobilityLimitationsDtoBreathingLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get cognitiveGames() {
    return z.array(
      z.nativeEnum(AddGameScoreDtoGameName, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      })
    );
  },
});

export const customScheduleBedriddenSchema = z.object({
  get physicalExercisesInBed() {
    return z
      .array(
        z.nativeEnum(ScheduleBedriddenDtoUserPhysicalExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_three_values') }
      )
      .min(3, { message: i18n.t('admin_form_error_select_at_least_three_values') })
      .max(5, { message: i18n.t('admin_form_error_select_max_five_values') });
  },
  get physicalExercisesLevel() {
    return z.nativeEnum(ScheduleBedriddenDtoPhysicalLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get breathingExercises() {
    return z
      .array(
        z.nativeEnum(ScheduleBedriddenDtoUserBreathingExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get breathingExercisesLevel() {
    return z.nativeEnum(ScheduleBedriddenDtoBreathingLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get personalGrowthChallenges() {
    return z.union([
      z.nativeEnum(ScheduleBedriddenDtoPersonalGrowth).optional(),
      z.nativeEnum(PersonalGrowth).optional(),
    ]);
  },
  get cognitiveGames() {
    return z.array(
      z.nativeEnum(AddGameScoreDtoGameName, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      })
    );
  },
});

export const customScheduleWithoutLimitationsSchema = z.object({
  get physicalExercises() {
    return z
      .array(
        z.nativeEnum(ScheduleNoLimitationsDtoUserPhysicalExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_three_values') }
      )
      .min(3, { message: i18n.t('admin_form_error_select_at_least_three_values') })
      .max(4, { message: i18n.t('admin_form_error_select_max_four_values') });
  },
  get physicalExercisesLevel() {
    return z.nativeEnum(ScheduleNoLimitationsDtoPhysicalLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get breathingExercises() {
    return z
      .array(
        z.nativeEnum(ScheduleNoLimitationsDtoUserBreathingExercisesItem, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_no_empty'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_at_least_one_value') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_at_least_one_value') })
      .max(2, { message: i18n.t('admin_form_error_select_max_two_values') });
  },
  get breathingExercisesLevel() {
    return z.nativeEnum(ScheduleNoLimitationsDtoBreathingLevel, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
  get personalGrowthChallenges() {
    return z.union([
      z.nativeEnum(ScheduleNoLimitationsDtoPersonalGrowth).optional(),
      z.nativeEnum(PersonalGrowth).optional(),
    ]);
  },
  get walkingExercises() {
    return z
      .array(
        z.nativeEnum(ScheduleNoLimitationsDtoUserWalkingExercises, {
          errorMap: () => ({
            message: i18n.t('admin_form_error_select_an_option'),
          }),
        }),
        { required_error: i18n.t('admin_form_error_select_an_option') }
      )
      .min(1, { message: i18n.t('admin_form_error_select_only_one_value') })
      .max(1, { message: i18n.t('admin_form_error_select_only_one_value') });
  },
  get cognitiveGames() {
    return z.array(
      z.nativeEnum(AddGameScoreDtoGameName, {
        errorMap: () => ({
          message: i18n.t('admin_form_error_no_empty'),
        }),
      })
    );
  },
});

export const reasonOfUpdatingCarePlanSchema = z.object({
  get updateCarePlanReason() {
    return z.nativeEnum(EditCarePlanReasonDtoEditCarePlanReason, {
      errorMap: () => ({
        message: i18n.t('admin_form_error_select_an_option'),
      }),
    });
  },
});

export const changePasswordSchema = z
  .object({
    get currentPassword() {
      return z
        .string()
        .min(1, { message: i18n.t('admin_alert_current_password_required') })
        .regex(passwordRegex, {
          message: i18n.t('admin_alert_password_hint'),
        });
    },
    get newPassword() {
      return z
        .string()
        .min(1, { message: i18n.t('admin_alert_new_password_required') })
        .regex(passwordRegex, {
          message: i18n.t('admin_alert_password_hint'),
        });
    },
    get confirmNewPassword() {
      return z.string().min(1, { message: i18n.t('admin_alert_confirm_new_password_required') });
    },
  })
  .refine(({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword, {
    message: i18n.t('admin_alert_passwords_reset_must_match'),
    path: ['confirmNewPassword'],
  })
  .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
    message: i18n.t('admin_alert_passwords_must_differ'),
    path: ['newPassword'],
  });

export const permissionSchema = z.object({
  get permissions() {
    return z
      .array(z.nativeEnum(UpdateInstitutionAdminRoleDtoRoleToAssign))
      .default([])
      .refine(permissions => permissions.length > 0, {
        message: i18n.t('admin_alert_select_at_least_one_role'),
      });
  },
});

export const assignNewCaregiverSchema = z.object({
  get id() {
    return z
      .number()
      .min(1, { message: i18n.t('admin_form_error_no_empty') })
      .optional();
  },
});
