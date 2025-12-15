import type {
  AddGameFeedbackAfterSecondLossGameName,
  AddGameFeedbackClosingGameBeforeCompletionGameName,
  AddGameFeedbackIncreasedDifficultyLevelGameName,
} from '@Procareful/common/api';
import { type GameData } from '@Procareful/common/lib';
import ChallengeRating from './ChallengeRating';
import CompletedGame from './CompletedGame';
import ExitSurvey from './ExitSurvey';

export const getFeedbackSteps = ({ feedbackType, points, time, status, name }: GameData) => {
  const feedbackConfig = {
    increasedDifficultyLevel: {
      components: [
        <CompletedGame key={0} points={points} time={time} status={status} type={feedbackType} />,
        <ChallengeRating
          key={1}
          gameName={name as unknown as AddGameFeedbackIncreasedDifficultyLevelGameName}
        />,
        <ExitSurvey
          key={2}
          type={feedbackType}
          gameName={name as unknown as AddGameFeedbackIncreasedDifficultyLevelGameName}
        />,
      ],
    },
    secondLoss: {
      components: [
        <CompletedGame key={0} points={points} time={time} status={status} type={feedbackType} />,
        <ExitSurvey
          key={1}
          type={feedbackType}
          gameName={name as unknown as AddGameFeedbackAfterSecondLossGameName}
        />,
      ],
    },
    closingGameBeforeCompletion: {
      components: [
        <ExitSurvey
          key={1}
          type={feedbackType}
          gameName={name as unknown as AddGameFeedbackClosingGameBeforeCompletionGameName}
          points={points}
        />,
        <CompletedGame key={0} points={points} time={time} status={status} type={feedbackType} />,
      ],
    },
  };

  if (!feedbackType) {
    return [<CompletedGame key={0} points={points} time={time} status={status} />];
  }

  return feedbackConfig[feedbackType]?.components;
};
