import { EActivityLevel, EUserPhysicalActivityGroup } from '../types';

export class GetUserAssessmentScore {
  id?: number;
  created_at?: Date;
  cognitive_abilities_group?: string;
  physical_activities_level?: string;
  social_abilities?: number;
  quality_of_life?: string;
  sleep_assessment?: number;
}
export class GetUserMobilityLevel {
  mobility_level: EUserPhysicalActivityGroup;
  recommended_level: EActivityLevel;
}
