import { EEnthusiasmLevel, EFrequency, EPartnerStatus, ESleepQuality } from '../types';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;

export class AddSleepAssessmentDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'bed_time' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'bed_time' }),
  })
  @Matches(timeRegex, {
    message: i18nValidationMessage(`${TValidationKey}.WAKE_UP_TIME_FORMAT`, { property: 'bed_time' }),
  })
  bed_time: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'fall_asleep_duration' }),
  })
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'fall_asleep_duration' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(480, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  fall_asleep_duration: number;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'wake_up_time' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'wake_up_time' }),
  })
  @Matches(timeRegex, {
    message: `${TValidationKey}.WAKE_UP_TIME_FORMAT`,
  })
  wake_up_time: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'actual_sleep_hours' }),
  })
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'actual_sleep_hours' }),
  })
  @Min(0, { message: i18nValidationMessage(`${TValidationKey}.MIN`) })
  @Max(24, { message: i18nValidationMessage(`${TValidationKey}.MAX`) })
  actual_sleep_hours: number;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'cannot_sleep_within_30_minutes' }),
  })
  cannot_sleep_within_30_minutes: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'wake_up_midnight_or_early_morning' }),
  })
  wake_up_midnight_or_early_morning: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'need_to_use_bathroom' }),
  })
  need_to_use_bathroom: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'cannot_breathe_comfortably' }),
  })
  cannot_breathe_comfortably: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'feel_too_cold' }),
  })
  feel_too_cold: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'feel_too_hot' }),
  })
  feel_too_hot: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'had_bad_dreams' }),
  })
  had_bad_dreams: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'have_pain' }),
  })
  have_pain: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'cough_or_snore_loudly' }),
  })
  cough_or_snore_loudly: EFrequency;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'other_reasons_for_trouble_sleeping' }),
  })
  other_reasons_for_trouble_sleeping?: string;

  @IsOptional()
  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, {
      property: 'other_reasons_for_trouble_sleeping_frequency',
    }),
  })
  sleeping_trouble_frequency?: EFrequency;

  @IsEnum(ESleepQuality, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sleep_quality_rating' }),
  })
  sleep_quality_rating: ESleepQuality;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'medicine_for_sleep' }),
  })
  medicine_for_sleep: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'trouble_staying_awake_frequency' }),
  })
  trouble_staying_awake_frequency: EFrequency;

  @IsEnum(EEnthusiasmLevel, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'enthusiasm_to_get_things_done' }),
  })
  enthusiasm_to_get_things_done: EEnthusiasmLevel;

  @IsEnum(EPartnerStatus, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'have_bed_partner_or_room_mate' }),
  })
  have_bed_partner_or_room_mate: EPartnerStatus;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'loud_snoring' }),
  })
  @IsOptional()
  loud_snoring?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'breathing_pause' }),
  })
  @IsOptional()
  breathing_pause?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'legs_twitching' }),
  })
  @IsOptional()
  legs_twitching?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'sleep_disorientation' }),
  })
  @IsOptional()
  sleep_disorientation?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'feel_too_cold_room_mate' }),
  })
  @IsOptional()
  feel_too_cold_room_mate?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'feel_too_hot_room_mate' }),
  })
  @IsOptional()
  feel_too_hot_room_mate?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'had_bad_dreams_room_mate' }),
  })
  @IsOptional()
  had_bad_dreams_room_mate?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'have_pain_room_mate' }),
  })
  @IsOptional()
  have_pain_room_mate?: EFrequency;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'cough_or_snore_loudly_room_mate' }),
  })
  @IsOptional()
  cough_or_snore_loudly_room_mate?: EFrequency;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'other_restlessness' }),
  })
  other_restlessness?: string;

  @IsEnum(EFrequency, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'trouble_sleeping_frequency_room_mate' }),
  })
  @IsOptional()
  trouble_sleeping_frequency_room_mate: EFrequency;
}
