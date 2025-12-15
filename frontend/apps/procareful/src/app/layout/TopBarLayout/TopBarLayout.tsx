import TopBar from '@ProcarefulApp/components/TopBar';
import type { TopBarType } from '@ProcarefulApp/types';
import type { ReactNode } from 'react';
import { type To, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { topBarLayoutTitle } from './constants';
import { useStyles } from './styles';

type TopBarLayoutProps = {
  title?: string;
  subtitle?: string | JSX.Element;
  backTo?: To;
  children: ReactNode;
  className?: string;
  subtitleClassName?: string;
  type?: TopBarType;
  isLoading?: boolean;
  showTutorialIcon?: boolean;
  onTutorialIconClick?: () => void;
  onClick?: () => void;
  screenTitle?: string;
};

const TopBarLayout = ({
  title,
  subtitle,
  backTo,
  children,
  className,
  subtitleClassName,
  type = 'arrow',
  isLoading,
  showTutorialIcon,
  onTutorialIconClick,
  screenTitle,
  onClick,
}: TopBarLayoutProps) => {
  const { styles, cx } = useStyles();
  const { pathname } = useLocation();

  const getTitle = () => {
    if (screenTitle) {
      return screenTitle;
    }

    if (title) {
      return title;
    }

    return topBarLayoutTitle[pathname as keyof typeof topBarLayoutTitle];
  };

  return (
    <div className={styles.container}>
      <div className={cx(styles.centeredContainer, className)}>
        <TopBar
          title={getTitle()}
          subtitle={subtitle}
          subtitleClassName={subtitleClassName}
          onTutorialIconClick={onTutorialIconClick}
          backTo={backTo}
          type={type}
          showTutorialIcon={showTutorialIcon}
          onClick={onClick}
        />
        {isLoading ? <Spin className={styles.spinner} size="large" /> : children}
      </div>
    </div>
  );
};

export default TopBarLayout;
