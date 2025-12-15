import { LocalStorageKey } from '@Procareful/common/lib/constants';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const useSecurityModal = () => {
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [isCheckLoading, setIsCheckLoading] = useState(true);

  useEffect(() => {
    const userBlockStartDate = localStorage.getItem(LocalStorageKey.UserBlockStartDate);

    if (userBlockStartDate) {
      const now = dayjs();
      const timeAfterTwentyMinutes = dayjs(userBlockStartDate).add(20, 'minute');

      const isBlockExpired = now.isAfter(timeAfterTwentyMinutes);

      if (isBlockExpired) {
        localStorage.removeItem(LocalStorageKey.UserBlockStartDate);
        setIsCheckLoading(false);

        return setIsUserBlocked(false);
      }

      setIsUserBlocked(true);
    }
    setIsCheckLoading(false);
  }, []);

  return { isUserBlocked, isCheckLoading };
};

export default useSecurityModal;
