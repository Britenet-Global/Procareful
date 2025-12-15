import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from '@ProcarefulAdmin/components/ProtectedRoute';
import {
  publicRoutes,
  protectedRoutes,
  onboardingEntryRoute,
} from '@ProcarefulAdmin/constants/routes';
import { useAuthControllerGetMe } from '@Procareful/common/api';
import { axiosInstance } from '@Procareful/common/api/axios';
import { i18n } from '@Procareful/common/i18n';
import { AuthLayout, Spinner } from '@Procareful/ui';
import PublicRoute from './components/PublicRoute';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';
import { verifyAccessByRole } from './utils';
import { getInitialRoute } from './utils/getInitialRoute';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const App = () => {
  const {
    data: userData,
    isLoading,
    isSuccess: isAuthenticated,
  } = useAuthControllerGetMe({
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    request: {},
  });

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await i18n.changeLanguage(userData?.details.lang.toLowerCase());
        axiosInstance.defaults.headers.common['X-Custom-Lang'] =
          userData?.details.lang.toLowerCase();

        return;
      }

      await i18n.changeLanguage(navigator.language || navigator.languages[0]);
      axiosInstance.defaults.headers.common['X-Custom-Lang'] =
        navigator.language || navigator.languages[0];
    })();
  }, [userData, isAuthenticated]);

  const { roles, first_login: hasLoggedInBefore } = userData?.details.admin || {};

  const initialRoute = getInitialRoute(isAuthenticated, hasLoggedInBefore, roles);

  if (isLoading || !initialRoute) {
    return <Spinner />;
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { index: true, element: <Navigate to={initialRoute} replace /> },
        {
          path: '/',
          element: <PublicRoute isAuthenticated={isAuthenticated} redirectPath={initialRoute} />,
          children: publicRoutes.flatMap(({ paths, element }) =>
            paths.map(path => ({
              path,
              element,
            }))
          ),
        },
        {
          element: <AuthLayout />,
          children: [
            {
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isAuthorized={verifyAccessByRole(onboardingEntryRoute.access, roles)}
                  redirectPath={initialRoute}
                >
                  {onboardingEntryRoute.element}
                </ProtectedRoute>
              ),
              path: onboardingEntryRoute.path,
            },
          ],
        },
        {
          element: <MainLayout />,
          children: protectedRoutes.flatMap(({ paths, access, element }) =>
            paths.map(path => ({
              path,
              element: (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isAuthorized={verifyAccessByRole(access, roles)}
                  redirectPath={initialRoute}
                >
                  {element}
                </ProtectedRoute>
              ),
            }))
          ),
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
