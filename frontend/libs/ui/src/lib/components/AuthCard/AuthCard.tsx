import { type ReactNode } from 'react';
import Description from './Description';
import Header from './Header';
import RedirectLink from './RedirectLink';
import SubmitButton from './SubmitButton';
import TermsAndPrivacyPolicy from './TermsAndPrivacyPolicy';
import TextButton from './TextButton';
import { useStyles } from './styles';

type AuthCardProps = {
  children: ReactNode;
  containerClassName?: string;
};

export const AuthCard = ({ children, containerClassName }: AuthCardProps) => {
  const { styles, cx } = useStyles();

  return <div className={cx(styles.container, containerClassName)}>{children}</div>;
};

AuthCard.Header = Header;
AuthCard.Description = Description;
AuthCard.SubmitButton = SubmitButton;
AuthCard.TextButton = TextButton;
AuthCard.RedirectLink = RedirectLink;
AuthCard.TermsAndPrivacyPolicy = TermsAndPrivacyPolicy;
