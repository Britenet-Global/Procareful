import { useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph, Text } from '@Procareful/ui';
import { Button } from 'antd';
import { PLACEHOLDER_TEXT } from './constants';
import { useStyles } from './styles';

type ReadOnlyFormProps = {
  positiveEmotions: string;
  stuckInMemoryTheMost: string;
  onEdit: () => void;
};

const ReadOnlyForm = ({ positiveEmotions, stuckInMemoryTheMost, onEdit }: ReadOnlyFormProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.feedbackContainer}>
        <div className={styles.dataContainer}>
          <Text strong>{t('senior_form_stuck_in_memory_the_most')}</Text>
          <Paragraph className={cx({ [styles.noDataValue]: !stuckInMemoryTheMost })}>
            {stuckInMemoryTheMost || t(PLACEHOLDER_TEXT)}
          </Paragraph>
        </div>
        <div className={styles.dataContainer}>
          <Text strong>{t('senior_form_positive_emotions')}</Text>
          <Paragraph className={cx({ [styles.noDataValue]: !positiveEmotions })}>
            {positiveEmotions || t(PLACEHOLDER_TEXT)}
          </Paragraph>
        </div>
      </div>
      <Button size="large" onClick={onEdit}>
        {t('shared_btn_edit')}
      </Button>
    </div>
  );
};

export default ReadOnlyForm;
