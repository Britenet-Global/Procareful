import {
  type AddGameFeedbackIncreasedDifficultyLevelGameName,
  type AddGameFeedbackAfterSecondLossGameName,
  type AddGameFeedbackClosingGameBeforeCompletionGameName,
  useUserControllerAddGameFeedbackClosingGameBeforeCompletion,
  useUserControllerAddGameFeedbackAfterSecondLoss,
  type AddGameFeedbackClosingGameBeforeCompletionFeedbackItem,
  type AddGameFeedbackAfterSecondLossFeedbackItem,
  type AddGameFeedbackIncreasedDifficultyLevelFeedbackItem,
  useUserControllerAddGameFeedbackIncreasedDifficultyLevel,
  type AddGameFeedbackIncreasedDifficultyLevelRating,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import {
  type GameData,
  LocalStorageKey,
  ProcarefulAppPathRoutes,
  SearchParams,
} from '@Procareful/common/lib';
import { FormBuilder, Text } from '@Procareful/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form } from 'antd';
import { exitSurveyContentConfig, gameWithoutSendPointsOnExitBeforeCompletion } from './constants';
import { useStyles } from './styles';

type ExitSurveyProps = {
  type: GameData['feedbackType'];
  gameName:
    | AddGameFeedbackIncreasedDifficultyLevelGameName
    | AddGameFeedbackAfterSecondLossGameName
    | AddGameFeedbackClosingGameBeforeCompletionGameName;
  points?: number;
};

const ExitSurvey = ({ type, gameName, points }: ExitSurveyProps) => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { title, label, feedbackOptions, formSchema } = exitSurveyContentConfig[type!];

  const {
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: [],
    },
  });

  const handleFeedbackOnSuccess = () => navigate(ProcarefulAppPathRoutes.Games);

  const {
    mutate: addGameFeedbackIncreasedDifficultyLevel,
    isPending: isAddGameFeedbackIncreasedDifficultyLevelPending,
  } = useUserControllerAddGameFeedbackIncreasedDifficultyLevel({
    mutation: {
      onSuccess: handleFeedbackOnSuccess,
    },
  });

  const { mutate: handleSendBrainPoints, isPending: isSendBrainPointsPending } =
    useUserControllerUpdateBrainPoints({
      mutation: {
        onSuccess: () => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set(SearchParams.Step, '1');
          setSearchParams(newSearchParams);
        },
      },
    });

  const {
    mutate: addGameFeedbackClosingGameBeforeCompletion,
    isPending: isAddGameFeedbackClosingGameBeforeCompletionPending,
  } = useUserControllerAddGameFeedbackClosingGameBeforeCompletion({
    mutation: {
      onSuccess: () => {
        if (!points || gameWithoutSendPointsOnExitBeforeCompletion.includes(gameName)) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set(SearchParams.Step, '1');
          setSearchParams(newSearchParams);

          return;
        }
        handleSendBrainPoints({ data: { points } });
      },
    },
  });

  const {
    mutate: addGameFeedbackAfterSecondLoss,
    isPending: isAddGameFeedbackAfterSecondLossPending,
  } = useUserControllerAddGameFeedbackAfterSecondLoss({
    mutation: {
      onSuccess: handleFeedbackOnSuccess,
    },
  });

  const onSubmit = ({ feedback }: z.infer<typeof formSchema>) => {
    if (type === 'secondLoss') {
      addGameFeedbackAfterSecondLoss({
        data: {
          game_name: gameName as AddGameFeedbackAfterSecondLossGameName,
          feedback: feedback as AddGameFeedbackAfterSecondLossFeedbackItem[],
        },
      });
    }

    if (type === 'closingGameBeforeCompletion') {
      addGameFeedbackClosingGameBeforeCompletion({
        data: {
          game_name: gameName as AddGameFeedbackClosingGameBeforeCompletionGameName,
          feedback: feedback as AddGameFeedbackClosingGameBeforeCompletionFeedbackItem[],
        },
      });
    }

    if (type === 'increasedDifficultyLevel') {
      const ratingLocalStorage = localStorage.getItem(LocalStorageKey.GameRate);
      const ratingParsed = ratingLocalStorage ? JSON.parse(ratingLocalStorage) : undefined;

      if (!ratingParsed) {
        return;
      }

      addGameFeedbackIncreasedDifficultyLevel({
        data: {
          rating: ratingParsed as AddGameFeedbackIncreasedDifficultyLevelRating,
          game_name: gameName as AddGameFeedbackIncreasedDifficultyLevelGameName,
          feedback: feedback as AddGameFeedbackIncreasedDifficultyLevelFeedbackItem[],
        },
      });
    }
  };

  const isButtonLoading =
    isAddGameFeedbackIncreasedDifficultyLevelPending ||
    isAddGameFeedbackClosingGameBeforeCompletionPending ||
    isAddGameFeedbackAfterSecondLossPending ||
    isSendBrainPointsPending;

  return (
    <div className={styles.container}>
      {title && <Text>{title}</Text>}
      <Form onFinish={handleSubmit(onSubmit)} className={styles.formContainer}>
        <FormBuilder.CheckboxGroupItem
          control={control}
          name="feedback"
          label={label}
          options={feedbackOptions}
          containerClassName={styles.checkboxGroup}
        />
        <Button
          type="primary"
          disabled={!isDirty}
          htmlType="submit"
          size="large"
          loading={isButtonLoading}
        >
          {t('shared_btn_save')}
        </Button>
      </Form>
    </div>
  );
};

export default ExitSurvey;
