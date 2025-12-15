import { Paragraph, Text } from '@Procareful/ui';
import type { TopBarType } from '@ProcarefulApp/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { Link, type To } from 'react-router-dom';
import { useStyles } from './styles';

type TopBarProps = {
  backTo?: To;
  type?: TopBarType;
  title: string;
  subtitle?: string | JSX.Element;
  subtitleClassName?: string;
  showTutorialIcon?: boolean;
  onTutorialIconClick?: () => void;
  onClick?: () => void;
};

const TopBar = ({
  backTo,
  type = 'arrow',
  title,
  subtitle,
  subtitleClassName,
  showTutorialIcon,
  onTutorialIconClick,
  onClick,
}: TopBarProps) => {
  const { styles, cx } = useStyles();

  const handleRenderGoBackIcon = () => (
    <>
      {type === 'arrow' && <ArrowBackIcon className={styles.icon} />}
      {type === 'close' && <CloseIcon className={styles.icon} />}
    </>
  );

  return (
    <>
      <div
        className={cx(styles.topBar, {
          [styles.topBarHorizontallyStretched]: !!backTo,
          [styles.topBarCentered]: !backTo && !onClick,
        })}
      >
        <div className={styles.marginContainer}>
          {backTo && (
            <Link className={styles.link} to={backTo}>
              {handleRenderGoBackIcon()}
            </Link>
          )}
          {onClick && (
            <div className={styles.link} onClick={onClick}>
              {handleRenderGoBackIcon()}
            </div>
          )}
        </div>
        <div className={styles.topBarElement}>
          <Text strong className={styles.title}>
            {title}
          </Text>
        </div>
        <ContactSupportOutlinedIcon
          className={cx(styles.icon, { [styles.hideIcon]: !showTutorialIcon })}
          onClick={onTutorialIconClick}
        />
      </div>
      {subtitle && (
        <div className={cx(styles.subtitle, subtitleClassName)}>
          {typeof subtitle === 'string' ? <Paragraph>{subtitle}</Paragraph> : subtitle}
        </div>
      )}
    </>
  );
};

export default TopBar;
