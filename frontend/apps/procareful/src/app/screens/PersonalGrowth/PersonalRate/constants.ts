import { UpdateUserFeedbackDtoPersonalRate } from '@Procareful/common/api';
import VeryDissatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-1.svg?react';
import DissatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-2.svg?react';
import NeutralIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-3.svg?react';
import SatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-4.svg?react';
import VerySatisfiedIcon from '@ProcarefulAppAssets/personal-growth/personal-rate-5.svg?react';

export const personalRateItems = [
  {
    icon: VeryDissatisfiedIcon,
    value: UpdateUserFeedbackDtoPersonalRate.very_dissatisfied,
    id: 1,
  },
  {
    icon: DissatisfiedIcon,
    value: UpdateUserFeedbackDtoPersonalRate.dissatisfied,
    id: 2,
  },
  {
    icon: NeutralIcon,
    value: UpdateUserFeedbackDtoPersonalRate.neutral,
    id: 3,
  },
  {
    icon: SatisfiedIcon,
    value: UpdateUserFeedbackDtoPersonalRate.satisfied,
    id: 4,
  },
  {
    icon: VerySatisfiedIcon,
    value: UpdateUserFeedbackDtoPersonalRate.very_satisfied,
    id: 5,
  },
];
