import { EPersonalRate } from '../types';

class UserPersonalGrowthChallenges {
  id: number;
  created_at: Date;
  title: string;
  description: string;
  icon_type: string;
}

export class GetPersonalGrowthChallengeDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  completed: boolean;
  active: boolean;
  personal_rate: EPersonalRate;
  stuck_in_memory_the_most: string;
  positive_emotions: string;
  user_personal_growth_challenges: UserPersonalGrowthChallenges;
}
