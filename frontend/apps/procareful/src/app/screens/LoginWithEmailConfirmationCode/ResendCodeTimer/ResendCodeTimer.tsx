import { LocalStorageKey } from '@Procareful/common/lib/constants';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Text } from '@Procareful/ui';
import { useState, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import { Trans } from 'react-i18next';
import { formatTime } from '../helpers';

type ResendCodeTimerProps = {
  initialTime?: number;
  delayTime?: number;
  children: ReactNode;
  onRunningStateChange: (isRunning: boolean) => void;
  className: string;
};

const ResendCodeTimer = forwardRef(
  (
    {
      initialTime,
      delayTime = 300,
      onRunningStateChange,
      children,
      className,
    }: ResendCodeTimerProps,
    ref
  ) => {
    const [timeLeft, setTimeLeft] = useState(initialTime ? delayTime - initialTime : delayTime);
    const { t } = useTypedTranslation();

    useImperativeHandle(ref, () => ({
      resetTimer: () => {
        setTimeLeft(delayTime);
      },
    }));

    useEffect(() => {
      if (timeLeft === 0) {
        return;
      }

      onRunningStateChange(true);

      const intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime - 1 === 0) {
            onRunningStateChange(false);
            localStorage.removeItem(LocalStorageKey.GeneratedCodeStartDate);
          }

          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(intervalId);
        onRunningStateChange(false);
      };
    }, [timeLeft, onRunningStateChange]);

    return (
      <Text className={className}>
        {children}&nbsp;
        {timeLeft > 0 && (
          <Trans>
            {t('senior_inf_in_time', {
              timeLeft: formatTime(timeLeft) || '',
            })}
          </Trans>
        )}
      </Text>
    );
  }
);

ResendCodeTimer.displayName = 'ResendCodeTimer';

export default ResendCodeTimer;
