import { type MouseEvent } from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Paragraph } from '@Procareful/ui';
import { useStyles } from './styles';

type TermsAndPrivacyPolicyProps = {
  i18nKey?: string;
  className?: string;
};

const TermsAndPrivacyPolicy = ({
  i18nKey = 'shared_inf_login_agreement_text',
  className,
}: TermsAndPrivacyPolicyProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault();

  return (
    <Paragraph className={cx(styles.termsAndPrivacyPolicy, className)}>
      <Trans
        i18nKey={i18nKey}
        components={{
          terms: (
            <Link to="#" onClick={handleLinkClick}>
              {t('admin_title_terms')}
            </Link>
          ),
          privacyPolicy: (
            <Link to="#" onClick={handleLinkClick}>
              {t('admin_title_privacy_policy')}
            </Link>
          ),
        }}
      />
    </Paragraph>
  );
};
export default TermsAndPrivacyPolicy;
