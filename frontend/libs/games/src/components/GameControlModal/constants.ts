import { i18n } from '@Procareful/common/i18n';

type GameResultType = {
  title: string;
  anotherRound?: string;
  firstButton: string;
  secondButton?: string;
  description?: string;
};

export const gameResult: { [key: string]: GameResultType } = {
  won: {
    get title() {
      return i18n.t('senior_games_modal_congratulation');
    },
    get description() {
      return i18n.t('senior_games_ready_for_next_round');
    },
    get firstButton() {
      return i18n.t('senior_games_modal_button_lets_go');
    },
  },
  lost: {
    get title() {
      return i18n.t('senior_games_modal_lost');
    },
    get description() {
      return i18n.t('senior_games_next_game_will_go_better');
    },
    get anotherRound() {
      return i18n.t('senior_games_ready_for_another_round');
    },
    get firstButton() {
      return i18n.t('senior_games_modal_button_lets_go');
    },
  },
  draw: {
    get title() {
      return i18n.t('senior_games_modal_draw_title');
    },
    get anotherRound() {
      return i18n.t('senior_games_modal_another_round');
    },
    get firstButton() {
      return i18n.t('senior_games_modal_button_lets_go');
    },
  },
  checkActivity: {
    get title() {
      return i18n.t('senior_games_modal_check_activity_title');
    },
    get description() {
      return i18n.t('senior_games_modal_check_activity_description');
    },
    get firstButton() {
      return i18n.t('senior_games_modal_button_still_playing');
    },
    get secondButton() {
      return i18n.t('senior_games_modal_button_exit_game');
    },
  },
  endGame: {
    get title() {
      return i18n.t('senior_games_modal_end_game_title');
    },
    get firstButton() {
      return i18n.t('senior_games_modal_button_back_to_game');
    },
    get secondButton() {
      return i18n.t('senior_games_modal_button_end');
    },
  },
};
