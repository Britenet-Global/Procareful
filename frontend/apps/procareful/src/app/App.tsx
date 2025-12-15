import {
  CaregiverControllerGetMyNotificationsFilterTitle,
  GetMyNotificationsDtoTitle,
  useUserControllerGetLanguage,
} from '@Procareful/common/api';
import { axiosInstance } from '@Procareful/common/api/axios';
import { ProcarefulAppPathRoutes, LocalStorageKey } from '@Procareful/common/lib';
import { useAuthStore, useTypedTranslation } from '@Procareful/common/lib/hooks';
import { AuthLayout } from '@Procareful/ui';
import { ErrorBoundary } from '@ProcarefulApp/components/ErrorBoundary/ErrorBoundary';
import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ConfirmationModal from './components/ConfirmationModal';
import Loader from './components/Loader';
import { protectedRoutes, publicRoutes } from './constants/routes';
import useSecurityModal from './hooks/useSecurityModal';
import SecurityLayout from './layout/SecurityLayout';
import Download from './screens/Download';
import LoginSecurityAlert from './screens/LoginSecurityAlert';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EVENT_URL = `${BASE_URL}/api/admin/caregiver/notifications/subscribe?title=${CaregiverControllerGetMyNotificationsFilterTitle.new_care_plan_changed}`;

export const App = () => {
  const { t } = useTypedTranslation();

  const { authState, setAuthState } = useAuthStore(state => ({
    authState: state.authState,
    setAuthState: state.setAuthState,
  }));
  const hasUserOnboarding = localStorage.getItem(LocalStorageKey.HasUserOnboarding);
  const [currentCarePlanId, setCurrentCarePlanId] = useState(
    localStorage.getItem(LocalStorageKey.CarePlanId)
  );

  const { data: languageData } = useUserControllerGetLanguage({
    query: {
      enabled: authState.isAuth,
    },
  });

  const { isUserBlocked, isCheckLoading } = useSecurityModal();

  const unauthorizedRoute = isUserBlocked
    ? ProcarefulAppPathRoutes.LoginSecurityAlert
    : ProcarefulAppPathRoutes.LoginMethod;
  const authenticateRoute = hasUserOnboarding
    ? ProcarefulAppPathRoutes.Dashboard
    : ProcarefulAppPathRoutes.Onboarding;
  const initialRoute = authState.isAuth ? authenticateRoute : unauthorizedRoute;

  const handleCarePlanModalConfirm = () => {
    setCurrentCarePlanId(null);
    localStorage.removeItem(LocalStorageKey.CarePlanId);
  };

  useEffect(() => {
    const changeLang = async () => {
      if (authState.isAuth) {
        await i18n.changeLanguage(languageData?.details.language.toLowerCase());

        return;
      }

      await i18n.changeLanguage(navigator.language || navigator.languages[0]);
    };
    axiosInstance.defaults.headers.common['X-Custom-Lang'] =
      languageData?.details.language.toLowerCase() || navigator.language || navigator.languages[0];
    changeLang();
  }, [languageData?.details.language, authState.isAuth]);

  useEffect(() => {
    if (languageData?.details.language) {
      setAuthState({ isAuth: true, isLoading: false });
    }
  }, [languageData?.details.language, setAuthState]);

  useEffect(() => {
    if (localStorage.getItem(LocalStorageKey.IsAuthenticated)) {
      return setAuthState({ isAuth: true, isLoading: true });
    }

    return setAuthState({ isAuth: false, isLoading: false });
  }, [setAuthState]);

  useEffect(() => {
    const sse = new EventSource(EVENT_URL, {
      withCredentials: true,
    });

    sse.onmessage = e => {
      const eventData = JSON.parse(e.data);

      if (
        eventData.type === 'ping' ||
        eventData.title !== GetMyNotificationsDtoTitle.new_care_plan_changed
      ) {
        return;
      }

      const newCarePlanId = eventData.id;

      if (currentCarePlanId !== newCarePlanId) {
        localStorage.setItem(LocalStorageKey.CarePlanId, JSON.stringify(newCarePlanId));
        setCurrentCarePlanId(newCarePlanId.toString());
      }

      sse.onerror = () => {
        sse.close();
      };

      return () => {
        sse.close();
      };
    };
  }, [currentCarePlanId]);

  if (authState.isLoading || isCheckLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to={initialRoute} replace />} />
          <Route element={<AuthLayout />}>
            <Route
              path={ProcarefulAppPathRoutes.LoginSecurityAlert}
              element={<LoginSecurityAlert />}
            />
            <Route element={<SecurityLayout isUserBlocked={isUserBlocked} />}>
              <Route path={ProcarefulAppPathRoutes.Download} element={<Download />} />
              {!authState.isAuth &&
                publicRoutes.map((route, index) => <Route key={index} {...route} />)}
              {authState.isAuth &&
                protectedRoutes.map((route, index) => <Route key={index} {...route} />)}
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={initialRoute} replace />} />
        </Routes>
        <ConfirmationModal
          title={t('senior_alert_new_care_plan_title')}
          description={t('senior_alert_new_care_plan_subtitle')}
          open={Boolean(currentCarePlanId)}
          onConfirm={handleCarePlanModalConfirm}
          confirmText={t('shared_btn_ok')}
        />
      </ErrorBoundary>
    </Router>
  );
};

export default App;
