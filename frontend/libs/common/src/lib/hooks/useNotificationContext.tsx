import { type ReactNode, createContext, useMemo, useContext } from 'react';
import { notification } from 'antd';
import { type NotificationInstance } from 'antd/es/notification/interface';

type NotificationContext = { notificationApi: NotificationInstance } | undefined;
const NotificationContext = createContext<NotificationContext>(undefined);

type NotificationContextProviderProps = {
  children: ReactNode;
};

const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
  const [notificationApi, contextHolder] = notification.useNotification({
    placement: 'topRight',
  });

  const notificationContextValue = useMemo(() => ({ notificationApi }), [notificationApi]);

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationContextProvider');
  }

  return context;
};

export { NotificationContextProvider, useNotificationContext };
