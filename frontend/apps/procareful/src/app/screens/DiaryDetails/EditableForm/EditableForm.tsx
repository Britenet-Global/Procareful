import {
  getUserControllerGetPersonalGrowthChallengeQueryKey,
  useUserControllerUpdateUserFeedback,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { memorableExperienceFeedbackSchema } from '@ProcarefulApp/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Button, Form, Input } from 'antd';
import { TEXTAREA_NUMBER_OF_ROWS } from './constants';
import { useStyles } from './styles';

type FeedbackData = z.infer<typeof memorableExperienceFeedbackSchema>;

type EditableFormProps = {
  positiveEmotions: string;
  stuckInMemoryTheMost: string;
  personalGrowthChallengeId: number;
  onFormComplete: () => void;
};

const { TextArea } = Input;

const EditableForm = ({
  positiveEmotions,
  stuckInMemoryTheMost,
  personalGrowthChallengeId,
  onFormComplete,
}: EditableFormProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FeedbackData>({
    resolver: zodResolver(memorableExperienceFeedbackSchema),
    values: {
      stuckInMemoryTheMost,
      positiveEmotions,
    },
  });

  const { mutate: addUserFeedback, isPending: isAddUserFeedbackPending } =
    useUserControllerUpdateUserFeedback({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getUserControllerGetPersonalGrowthChallengeQueryKey(
              Number(personalGrowthChallengeId)
            ),
          });
          onFormComplete();
        },
      },
    });

  const onSubmit = ({ positiveEmotions, stuckInMemoryTheMost }: FeedbackData) => {
    if (!personalGrowthChallengeId) {
      return;
    }

    addUserFeedback({
      personalGrowthId: Number(personalGrowthChallengeId),
      data: {
        positive_emotions: positiveEmotions || undefined,
        stuck_in_memory_the_most: stuckInMemoryTheMost || undefined,
      },
    });
  };

  return (
    <Form className={styles.container} layout="vertical">
      <FormItem
        control={control}
        name="stuckInMemoryTheMost"
        label={t('senior_form_stuck_in_memory_the_most')}
      >
        <TextArea rows={TEXTAREA_NUMBER_OF_ROWS} />
      </FormItem>
      <FormItem
        control={control}
        name="positiveEmotions"
        label={t('senior_form_positive_emotions')}
      >
        <TextArea rows={TEXTAREA_NUMBER_OF_ROWS} />
      </FormItem>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handleSubmit(onSubmit)}
          type="primary"
          htmlType="submit"
          size="large"
          loading={isAddUserFeedbackPending}
          disabled={!isDirty}
        >
          {t('shared_btn_save')}
        </Button>
        <Button onClick={onFormComplete} size="large">
          {t('shared_btn_cancel')}
        </Button>
      </div>
    </Form>
  );
};

export default EditableForm;
