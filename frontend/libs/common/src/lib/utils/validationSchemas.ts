import { z } from 'zod';
import { i18n } from '@Procareful/common/i18n';

const codeRegex = /^\d{3}-\d{3}$/;
const phoneNumberRegex = /^\+[0-9]{1,3}-[0-9]{6,12}$/;
export const alphanumericSpecialCharsRegex = /^[\p{L}\p{N}\s'",.\-!@#$%^&*()_+=\\|[\]{};:/?.>]+$/u;

export const emailSchema = z.object({
  get email() {
    return z
      .string()
      .min(1, { message: i18n.t('shared_alert_email_required') })
      .email({ message: i18n.t('shared_alert_email_invalid') });
  },
});

export const confirmationCodeSchema = z.object({
  get code() {
    return z
      .string()
      .min(1, { message: i18n.t('senior_alert_code_required') })
      .regex(codeRegex, { message: i18n.t('senior_alert_code_invalid') });
  },
});

export const phoneSchema = z.object({
  get phoneNumber() {
    return z
      .string()
      .min(1, { message: i18n.t('shared_alert_no_empty_phone_number') })
      .regex(phoneNumberRegex, { message: i18n.t('shared_alert_invalid_cellphone_format') });
  },
});

export const optionalEmailSchema = z
  .union([z.string().email({ message: i18n.t('shared_alert_email_invalid') }), z.literal('')])
  .optional();

export const optionalPhoneNumberSchema = z
  .union([
    z
      .string()
      .regex(phoneNumberRegex, { message: i18n.t('shared_alert_invalid_cellphone_format') }),
    z.literal(''),
  ])
  .optional();
