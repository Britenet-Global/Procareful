import { useLocation } from 'react-router-dom';
import { useTypedTranslation } from '@Procareful/common/lib';

export const Caregivers = () => {
  const { pathname } = useLocation();
  const { t } = useTypedTranslation();

  const pageTitle: Record<string, string> = {
    '/formal-caregivers': t('admin_title_formal_caregivers'),
    '/informal-caregivers': t('admin_title_informal_caregivers'),
  };

  return (
    <section>
      <h1>{pageTitle[pathname]}</h1>
    </section>
  );
};

export default Caregivers;
