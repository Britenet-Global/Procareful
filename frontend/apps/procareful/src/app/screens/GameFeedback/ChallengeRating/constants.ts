import { AddGameFeedbackIncreasedDifficultyLevelRating } from '@Procareful/common/api';
import VeryDissatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-1.svg?react';
import DissatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-2.svg?react';
import NeutralIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-3.svg?react';
import SatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-4.svg?react';
import VerySatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-5.svg?react';

export const challengeRatingOptions = [
  {
    icon: VeryDissatisfiedIcon,
    value: AddGameFeedbackIncreasedDifficultyLevelRating.very_dissatisfied,
    id: 1,
  },
  {
    icon: DissatisfiedIcon,
    value: AddGameFeedbackIncreasedDifficultyLevelRating.dissatisfied,
    id: 2,
  },
  {
    icon: NeutralIcon,
    value: AddGameFeedbackIncreasedDifficultyLevelRating.neutral,
    id: 3,
  },
  {
    icon: SatisfiedIcon,
    value: AddGameFeedbackIncreasedDifficultyLevelRating.satisfied,
    id: 4,
  },
  {
    icon: VerySatisfiedIcon,
    value: AddGameFeedbackIncreasedDifficultyLevelRating.very_satisfied,
    id: 5,
  },
];

export const negativeOrNeutralFeedbackOptions = [
  AddGameFeedbackIncreasedDifficultyLevelRating.very_dissatisfied,
  AddGameFeedbackIncreasedDifficultyLevelRating.dissatisfied,
  AddGameFeedbackIncreasedDifficultyLevelRating.neutral,
];
