import {
  type AddGameFeedbackIncreasedDifficultyLevelGameName,
  type AddGameFeedbackIncreasedDifficultyLevelRating,
  useUserControllerAddGameFeedbackIncreasedDifficultyLevel,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import {
  LocalStorageKey,
  ProcarefulAppPathRoutes,
  SearchParams,
} from '@Procareful/common/lib/constants';
import { Text } from '@Procareful/ui';
import ChallengeRatingRadioButton from '@ProcarefulApp/components/ChallengeRatingRadioButton';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { challengeRatingOptions, negativeOrNeutralFeedbackOptions } from './constants';
import { useStyles } from './styles';

type ChallengeRatingProps = {
  gameName: AddGameFeedbackIncreasedDifficultyLevelGameName;
};

const ChallengeRating = ({ gameName }: ChallengeRatingProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState<AddGameFeedbackIncreasedDifficultyLevelRating>();

  const { mutate: addGameFeedbackIncreasedDifficultyLevel } =
    useUserControllerAddGameFeedbackIncreasedDifficultyLevel({
      mutation: {
        onSuccess: () => {
          navigate(ProcarefulAppPathRoutes.Games);
        },
      },
    });

  const handleSubmit = () => {
    if (!rating) {
      return;
    }

    const needsAdditionalFeedbackInformation = negativeOrNeutralFeedbackOptions.includes(rating);

    if (needsAdditionalFeedbackInformation) {
      localStorage.setItem(LocalStorageKey.GameRate, JSON.stringify(rating));
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(SearchParams.Step, '2');
      setSearchParams(newSearchParams, { replace: true });

      return;
    }

    addGameFeedbackIncreasedDifficultyLevel({
      data: {
        rating,
        game_name: gameName as AddGameFeedbackIncreasedDifficultyLevelGameName,
      },
    });
  };

  return (
    <div className={styles.container}>
      <Text className={styles.title}>{t('senior_games_raised_difficulty_level_information')}</Text>
      <ChallengeRatingRadioButton
        className={styles.label}
        label={t('senior_games_how_was_the_challenge_this_time')}
        value={rating}
        options={challengeRatingOptions}
        onChange={setRating}
      />
      <Button
        type="primary"
        disabled={!rating}
        className={styles.submitButton}
        size="large"
        onClick={handleSubmit}
      >
        {t('shared_btn_save')}
      </Button>
    </div>
  );
};

export default ChallengeRating;
