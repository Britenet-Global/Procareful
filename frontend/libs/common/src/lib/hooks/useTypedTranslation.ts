import { type i18n } from 'i18next';
import { type UseTranslationOptions, useTranslation } from 'react-i18next';
import { type en } from '../../i18n/translations';

type Prefixes = 'admin' | 'shared' | 'senior';
type SubPrefixes = 'btn' | 'title' | 'form' | 'inf' | 'alert' | 'table' | 'games';
type Dict = keyof typeof en.translations;
type PrefixPattern = `${Prefixes}_${SubPrefixes}_${string}`;
export type Key = Extract<Dict, PrefixPattern>;

type CustomTranslationOptions<T = Record<string, unknown>> = UseTranslationOptions<T> & {
  [key: string]: string;
};

export const useTypedTranslation = <T>(): {
  t: (key: Key, options?: CustomTranslationOptions<T>) => string;
  i18n: i18n;
} => {
  const { t: tt, i18n } = useTranslation();

  const t = (key: Key, options?: CustomTranslationOptions<T>) => tt(key, options);

  return { t, i18n };
};
