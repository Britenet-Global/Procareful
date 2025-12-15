import {
  GeneratedSingleScheduleDtoBreathingExercisesItem,
  GetUserActivityDtoPosition,
} from '@Procareful/common/api';
// lower body exercises
import AirlineSeatLegroomExtraIcon from '@mui/icons-material/AirlineSeatLegroomExtra';
// walking
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
// exercise in bed
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
// coordination & balance
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
// breathing
import WavesIcon from '@mui/icons-material/Waves';
// upper body exercise
import PersonCelebrate from '@ProcarefulAppAssets/physical-activities/person-celebrate.svg';

export const renderActivityIcon = (
  exerciseName: string | null,
  exercisePosition?: GetUserActivityDtoPosition
) => {
  if (!exerciseName) {
    return <DirectionsWalkIcon />;
  }

  const breathingExercises = Object.keys(GeneratedSingleScheduleDtoBreathingExercisesItem);
  const isBreathingExercises = breathingExercises.includes(exerciseName);

  if (exercisePosition === GetUserActivityDtoPosition.fall_prevention && !isBreathingExercises) {
    return <SportsGymnasticsIcon />;
  }

  if (exercisePosition === GetUserActivityDtoPosition.exercise_in_bed && !isBreathingExercises) {
    return <SelfImprovementIcon />;
  }

  if (exercisePosition === GetUserActivityDtoPosition.sitting_lower_body && !isBreathingExercises) {
    return <AirlineSeatLegroomExtraIcon />;
  }

  if (exercisePosition === GetUserActivityDtoPosition.sitting_upper_body && !isBreathingExercises) {
    return <PersonCelebrate />;
  }

  if (
    exercisePosition === GetUserActivityDtoPosition.sitting_balance_and_coordination &&
    !isBreathingExercises
  ) {
    return <SportsGymnasticsIcon />;
  }

  if (exercisePosition === GetUserActivityDtoPosition.exercise_sitting && !isBreathingExercises) {
    return <WavesIcon />;
  }
  if (isBreathingExercises) {
    return <WavesIcon />;
  }
};
