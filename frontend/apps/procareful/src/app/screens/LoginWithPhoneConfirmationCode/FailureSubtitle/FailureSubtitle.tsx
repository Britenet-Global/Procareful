import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Paragraph } from '@Procareful/ui';

const FailureSubtitle = () => {
  const { t } = useTypedTranslation();

  return <Paragraph>{t('senior_title_invalid_code_instructions')}</Paragraph>;
};

export default FailureSubtitle;
