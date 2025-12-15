import { queryClient } from '@Procareful/common/api/queryClient';
import { i18n } from '@Procareful/common/i18n';
import { NotificationContextProvider } from '@Procareful/common/lib';
import { ThemeProvider } from '@Procareful/ui';
import '@Procareful/ui/assets/global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './app/App';

window.addEventListener('vite:preloadError', event => {
  console.error('Vite preload error:', event);
  window.location.reload();
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
);
