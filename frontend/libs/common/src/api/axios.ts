import axios, { HttpStatusCode, type AxiosError, type AxiosRequestConfig } from 'axios';
import { LocalStorageKey } from '../lib/constants/enums';
import { useAuthStore } from '../lib/hooks';

export type ErrorType<Error> = AxiosError<Error>;

export const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Accept-Language': 'en-US',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    config.data = {
      ...config.data,
    };
    return config;
  },
  error => {
    console.log('error', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === HttpStatusCode.Unauthorized ||
        error.response.status === HttpStatusCode.Forbidden)
    ) {
      localStorage.removeItem(LocalStorageKey.IsAuthenticated);
      useAuthStore.getState().setAuthState({ isAuth: false, isLoading: false });
    }

    return Promise.reject(error);
  }
);

export const axiosWrapper = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  return promise;
};
