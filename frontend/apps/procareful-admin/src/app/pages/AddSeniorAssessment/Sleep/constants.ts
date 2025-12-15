import {
  AddSleepAssessmentDtoCannotSleepWithin30Minutes,
  AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning,
  AddSleepAssessmentDtoNeedToUseBathroom,
  AddSleepAssessmentDtoCannotBreatheComfortably,
  AddSleepAssessmentDtoCoughOrSnoreLoudly,
  AddSleepAssessmentDtoFeelTooHot,
  AddSleepAssessmentDtoFeelTooCold,
  AddSleepAssessmentDtoHadBadDreams,
  AddSleepAssessmentDtoHavePain,
  AddSleepAssessmentDtoSleepingTroubleFrequency,
  AddSleepAssessmentDtoMedicineForSleep,
  AddSleepAssessmentDtoTroubleStayingAwakeFrequency,
  AddSleepAssessmentDtoEnthusiasmToGetThingsDone,
  AddSleepAssessmentDtoSleepQualityRating,
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
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const cannotSleepWithin30MinutesOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoCannotSleepWithin30Minutes.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoCannotSleepWithin30Minutes.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoCannotSleepWithin30Minutes.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoCannotSleepWithin30Minutes.three_or_more_times,
  },
];

export const wakeUpTimeOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoWakeUpMidnightOrEarlyMorning.three_or_more_times,
  },
];

export const needToUseBathroomOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoNeedToUseBathroom.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoNeedToUseBathroom.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoNeedToUseBathroom.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoNeedToUseBathroom.three_or_more_times,
  },
];

export const cannotBreatheComfortablyOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoCannotBreatheComfortably.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoCannotBreatheComfortably.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoCannotBreatheComfortably.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoCannotBreatheComfortably.three_or_more_times,
  },
];

export const coughOrSnoreLoudlyOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudly.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudly.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudly.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudly.three_or_more_times,
  },
];

export const feelTooColdOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoFeelTooCold.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoFeelTooCold.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoFeelTooCold.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoFeelTooCold.three_or_more_times,
  },
];

export const feelTooHotOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoFeelTooHot.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoFeelTooHot.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoFeelTooHot.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoFeelTooHot.three_or_more_times,
  },
];

export const hadBadDreamsOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoHadBadDreams.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoHadBadDreams.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoHadBadDreams.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoHadBadDreams.three_or_more_times,
  },
];

export const havePainOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoHavePain.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoHavePain.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoHavePain.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoHavePain.three_or_more_times,
  },
];

export const sleepingTroubleFrequencyOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoSleepingTroubleFrequency.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoSleepingTroubleFrequency.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoSleepingTroubleFrequency.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoSleepingTroubleFrequency.three_or_more_times,
  },
];

export const medicineForSleepOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoMedicineForSleep.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoMedicineForSleep.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoMedicineForSleep.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoMedicineForSleep.three_or_more_times,
  },
];

export const troubleStayingAwakeWhileDrivingOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoTroubleStayingAwakeFrequency.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoTroubleStayingAwakeFrequency.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoTroubleStayingAwakeFrequency.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoTroubleStayingAwakeFrequency.three_or_more_times,
  },
];

export const enthusiasmToGetThingsDoneOptions = [
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_very_big_problem');
    },
    value: AddSleepAssessmentDtoEnthusiasmToGetThingsDone.a_very_big_problem,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_somewhat_problem');
    },
    value: AddSleepAssessmentDtoEnthusiasmToGetThingsDone.somewhat_a_problem,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_slight_problem');
    },
    value: AddSleepAssessmentDtoEnthusiasmToGetThingsDone.very_slight_problem,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_no_problem');
    },
    value: AddSleepAssessmentDtoEnthusiasmToGetThingsDone.no_problem,
  },
];

export const sleepQualityRatingOptions = [
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_very_good');
    },
    value: AddSleepAssessmentDtoSleepQualityRating.very_good,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_fairly_good');
    },
    value: AddSleepAssessmentDtoSleepQualityRating.fairly_good,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_fairly_bad');
    },
    value: AddSleepAssessmentDtoSleepQualityRating.fairly_bad,
  },
  {
    get label() {
      return i18n.t('admin_form_sleep_quality_option_very_bad');
    },
    value: AddSleepAssessmentDtoSleepQualityRating.very_bad,
  },
];

export const haveBedPartnerOrRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_inf_have_bed_partner_or_room_mate_option_no_partner');
    },
    value: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.no_partner_or_roommate,
  },
  {
    get label() {
      return i18n.t('admin_inf_have_bed_partner_or_room_mate_option_partner_in_other_room');
    },
    value: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.partner_in_other_room,
  },
  {
    get label() {
      return i18n.t('admin_inf_have_bed_partner_or_room_mate_option_partner_not_the_same_bed');
    },
    value: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.partner_same_room_not_bed,
  },
  {
    get label() {
      return i18n.t('admin_inf_have_bed_partner_or_room_mate_option_partner_the_same_bed');
    },
    value: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.partner_same_bed,
  },
];

export const loudSnoringOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoLoudSnoring.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoLoudSnoring.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoLoudSnoring.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoLoudSnoring.three_or_more_times,
  },
];

export const breathingPauseOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoBreathingPause.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoBreathingPause.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoBreathingPause.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoBreathingPause.three_or_more_times,
  },
];

export const legsTwitchingOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoLegsTwitching.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoLegsTwitching.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoLegsTwitching.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoLegsTwitching.three_or_more_times,
  },
];

export const sleepDisorientationOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoSleepDisorientation.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoSleepDisorientation.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoSleepDisorientation.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoSleepDisorientation.three_or_more_times,
  },
];

export const coughOrSnoreLoudlyRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoCoughOrSnoreLoudlyRoomMate.three_or_more_times,
  },
];

export const feelTooColdRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoFeelTooColdRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoFeelTooColdRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoFeelTooColdRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoFeelTooColdRoomMate.three_or_more_times,
  },
];

export const feelTooHotRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoFeelTooHotRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoFeelTooHotRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoFeelTooHotRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoFeelTooHotRoomMate.three_or_more_times,
  },
];

export const hadBadDreamsRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoHadBadDreamsRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoHadBadDreamsRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoHadBadDreamsRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoHadBadDreamsRoomMate.three_or_more_times,
  },
];

export const havePainRoomMateOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoHavePainRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoHavePainRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoHavePainRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoHavePainRoomMate.three_or_more_times,
  },
];

export const otherRestlessNessFrequencyOptions = [
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_not_past_month');
    },
    value: AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate.not_past_month,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_less_than_once');
    },
    value: AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate.less_than_once,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_once_or_twice');
    },
    value: AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate.once_or_twice,
  },
  {
    get label() {
      return i18n.t('admin_form_trouble_sleeping_option_three_or_more_times');
    },
    value: AddSleepAssessmentDtoTroubleSleepingFrequencyRoomMate.three_or_more_times,
  },
];
