import { useQueryClient } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import {
  getAuthControllerGetMeQueryKey,
  getCaregiverControllerGetMyNotificationsQueryKey,
  GetMyNotificationsDtoTitle,
} from '@Procareful/common/api';

export const useServerSentEvents = (
  eventUrl: string,
  incrementNotificationCount: Dispatch<SetStateAction<number>>,
  shouldUseSSE: boolean
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldUseSSE) {
      return;
    }

    const sse = new EventSource(eventUrl, {
      withCredentials: true,
    });

    sse.onmessage = e => {
      const eventData = JSON.parse(e.data);

      if (eventData.type === 'ping') {
        return;
      }

      if (eventData.role === GetMyNotificationsDtoTitle.role_updated) {
        queryClient.invalidateQueries({
          queryKey: getAuthControllerGetMeQueryKey(),
        });
        navigate(PathRoutes.Dashboard);

        return;
      }

      if (
        eventData.title === GetMyNotificationsDtoTitle.new_care_plan_changed ||
        eventData.title === GetMyNotificationsDtoTitle.role_updated
      ) {
        return;
      }

      incrementNotificationCount(prevCount => prevCount + 1);
      queryClient.invalidateQueries({
        queryKey: getCaregiverControllerGetMyNotificationsQueryKey(),
      });
    };
    sse.onerror = () => {
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, [eventUrl, incrementNotificationCount, queryClient, shouldUseSSE, navigate]);
};
