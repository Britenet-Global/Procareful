import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider } from 'antd';
import App from '@ProcarefulAdmin/App';
import { queryClient } from '@Procareful/common/api/queryClient';
import { i18n } from '@Procareful/common/i18n';
import { NotificationContextProvider } from '@Procareful/common/lib';
import { ProcarefulTheme } from '@Procareful/ui';
import '@Procareful/ui/assets/global.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={ProcarefulTheme}>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </ConfigProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
);
