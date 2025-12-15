import { AddCognitiveAbilitiesDto } from './add-cognitive-abilities.dto';
import { AddPhysicalActivitiesDto } from './add-physical-activities.dto';
import { AddSocialAbilitiesDto } from './add-social-abilities.dto';
import { AddQualityOfLifeDto } from './add-quality-of-life.dto';
import { AddSleepAssessmentDto } from './add-sleep-assessment.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddUserAssessmentDto {
  @ValidateNested()
  @Type(() => AddCognitiveAbilitiesDto)
  cognitive_abilities: AddCognitiveAbilitiesDto;

  @ValidateNested()
  @Type(() => AddPhysicalActivitiesDto)
  physical_activities: AddPhysicalActivitiesDto;

  @ValidateNested()
  @Type(() => AddSocialAbilitiesDto)
  social_abilities: AddSocialAbilitiesDto;

  @ValidateNested()
  @Type(() => AddQualityOfLifeDto)
  quality_of_life: AddQualityOfLifeDto;

  @ValidateNested()
  @Type(() => AddSleepAssessmentDto)
  sleep_assessment: AddSleepAssessmentDto;
}
