import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Title } from '@Procareful/ui';

const NotFound = () => {
  const { t } = useTypedTranslation();

  return (
    <div>
      <Title level={3}>{t('shared_title_page_not_found')}</Title>
    </div>
  );
};

export default NotFound;
