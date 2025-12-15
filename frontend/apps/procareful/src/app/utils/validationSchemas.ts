import {
  AddGameFeedbackAfterSecondLossFeedbackItem,
  AddGameFeedbackClosingGameBeforeCompletionFeedbackItem,
  AddGameFeedbackIncreasedDifficultyLevelFeedbackItem,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { z } from 'zod';

export const memorableExperienceFeedbackSchema = z.object({
  stuckInMemoryTheMost: z
    .string()
    .max(256, {
      get message() {
        return i18n.t('admin_form_error_too_much_chars', { count: 256 });
      },
    })

    .trim()
    .optional(),
  positiveEmotions: z
    .string()
    .max(256, {
      get message() {
        return i18n.t('admin_form_error_too_much_chars', { count: 256 });
      },
    })
    .trim()
    .optional(),
});

export const increasedDifficultyLevelSchema = z.object({
  feedback: z.array(z.nativeEnum(AddGameFeedbackIncreasedDifficultyLevelFeedbackItem)).default([]),
});

export const secondLossSchema = z.object({
  feedback: z.array(z.nativeEnum(AddGameFeedbackAfterSecondLossFeedbackItem)).default([]),
});

export const closingGameBeforeCompletionSchema = z.object({
  feedback: z
    .array(z.nativeEnum(AddGameFeedbackClosingGameBeforeCompletionFeedbackItem))
    .default([]),
});
