import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { notification } from 'antd';
import { i18n } from '@Procareful/common/i18n';
import { type ErrorResponse } from './api';
import { getAuthControllerGetMeQueryKey } from './services';

const defaultError = {
  get defaultErrorTitle() {
    return i18n.t('admin_title_alert_error');
  },
  get defaultErrorMessage() {
    return i18n.t('admin_inf_alert_title');
  },
};

export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const isAuthMeRequest =
        JSON.stringify(getAuthControllerGetMeQueryKey()) === JSON.stringify(query.queryKey);

      const axiosError = error as ErrorResponse;

      if (!isAuthMeRequest && axiosError.response?.status === HttpStatusCode.Unauthorized) {
        window.location.reload();
      }

      if (isAuthMeRequest || axiosError.response?.status === HttpStatusCode.NotFound) {
        return;
      }

      const { title, message } = axiosError.response?.data.notification || {};

      if (!title && !message) {
        notification.error({
          message: defaultError.defaultErrorTitle,
          description: defaultError.defaultErrorMessage,
        });

        return;
      }

      notification.error({
        message: title ?? undefined,
        description: message ?? undefined,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _1, _2, mutation) => {
      const axiosError = error as ErrorResponse;
      const { title, message } = axiosError.response?.data.notification || {};

      if (mutation?.meta?.disableGlobalNotification) {
        return;
      }

      if (!title && !message) {
        notification.error({
          message: defaultError.defaultErrorTitle,
          description: defaultError.defaultErrorMessage,
        });

        return;
      }

      notification.error({
        message: title ?? undefined,
        description: message ?? undefined,
      });
    },
  }),
});
