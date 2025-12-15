import { z } from 'zod';
import {
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
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const troubleSleepingPartnerSchema = z
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
    otherRestlessness: z.string().optional().or(z.literal('')),
  })
  .refine(
    data =>
      data.haveBedPartnerOrRoomMate !==
        AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.no_partner_or_roommate ||
      data.haveBedPartnerOrRoomMate,
    {
      path: ['timeSittingLastWeek'],
      get message() {
        return i18n.t('admin_form_error_no_empty');
      },
    }
  );
