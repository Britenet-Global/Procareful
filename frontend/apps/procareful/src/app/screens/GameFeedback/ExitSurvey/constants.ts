import {
  AddGameFeedbackAfterSecondLossFeedbackItem,
  AddGameFeedbackClosingGameBeforeCompletionFeedbackItem,
  AddGameFeedbackIncreasedDifficultyLevelFeedbackItem,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import {
  closingGameBeforeCompletionSchema,
  increasedDifficultyLevelSchema,
  secondLossSchema,
} from '@ProcarefulApp/utils/validationSchemas';

const increaseLevelFeedbackOptions = [
  {
    get label() {
      return i18n.t('senior_games_feedback_felt_overwhelmed');
    },
    value: AddGameFeedbackIncreasedDifficultyLevelFeedbackItem.felt_overwhelmed,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_too_challenging');
    },
    value: AddGameFeedbackIncreasedDifficultyLevelFeedbackItem.too_challenging,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_wish_the_difficulty_increase_more_gradual');
    },
    value: AddGameFeedbackIncreasedDifficultyLevelFeedbackItem.wish_difficulty_increase_gradual,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_less_enjoyable');
    },
    value: AddGameFeedbackIncreasedDifficultyLevelFeedbackItem.less_enjoyable,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_other');
    },
    value: AddGameFeedbackIncreasedDifficultyLevelFeedbackItem.other,
  },
];

const secondLossFeedbackOptions = [
  {
    get label() {
      return i18n.t('senior_games_feedback_found_bug');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.found_bug_or_issue,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_did_no_understand_game_objective');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.did_not_understand_objective,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_found_controls_confusing');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.confusing_controls,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_game_too_challenging');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.too_challenging,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_other');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.other,
  },
];

const closingGameBeforeCompletionFeedbackOptions = [
  {
    get label() {
      return i18n.t('senior_games_feedback_found_bug');
    },
    value: AddGameFeedbackClosingGameBeforeCompletionFeedbackItem.found_bug_or_issue,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_game_prefer_other_games');
    },
    value: AddGameFeedbackClosingGameBeforeCompletionFeedbackItem.prefer_other_games,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_did_not_understand_objective');
    },
    value: AddGameFeedbackClosingGameBeforeCompletionFeedbackItem.did_not_understand_objective,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_game_too_challenging');
    },
    value: AddGameFeedbackClosingGameBeforeCompletionFeedbackItem.too_challenging,
  },
  {
    get label() {
      return i18n.t('senior_games_feedback_other');
    },
    value: AddGameFeedbackAfterSecondLossFeedbackItem.other,
  },
];

export const exitSurveyContentConfig = {
  increasedDifficultyLevel: {
    get title() {
      return i18n.t('senior_games_feedback_raised_level_title');
    },
    get label() {
      return i18n.t('senior_games_feedback_game_raised_level_label');
    },
    feedbackOptions: increaseLevelFeedbackOptions,
    formSchema: increasedDifficultyLevelSchema,
  },
  secondLoss: {
    get title() {
      return i18n.t('senior_games_feedback_second_loss_title');
    },
    get label() {
      return i18n.t('senior_games_feedback_game_raised_level_label');
    },
    feedbackOptions: secondLossFeedbackOptions,
    formSchema: secondLossSchema,
  },
  closingGameBeforeCompletion: {
    get title() {
      return '';
    },
    get label() {
      return i18n.t('senior_games_feedback_finish_before_completion_label');
    },
    feedbackOptions: closingGameBeforeCompletionFeedbackOptions,
    formSchema: closingGameBeforeCompletionSchema,
  },
};

export const gameWithoutSendPointsOnExitBeforeCompletion = [
  'tic_tac_toe',
  'game_2048',
  'word_guess',
];
