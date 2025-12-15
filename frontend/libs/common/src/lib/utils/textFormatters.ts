import { formatEuropeanPhoneNumber } from './formatMask';

export const truncateSentence = (str: string | undefined, maxChars: number): string => {
  if (!str) {
    return '';
  }
  const numberOfDots = 3;

  if (str.length > maxChars) {
    return str.slice(0, maxChars - numberOfDots) + '...';
  }

  return str;
};

export const toCamelCase = (str: string) =>
  str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatPhoneToDisplay = (phoneNumber: string) => {
  const prefixMatch = phoneNumber.match(/^\+\d+/);
  const countryPrefix = prefixMatch?.[0];

  if (!countryPrefix) {
    return phoneNumber;
  }

  const cleanedValue = phoneNumber.replace(/^\+\d+-/, '');
  const formattedNumber = formatEuropeanPhoneNumber(cleanedValue, countryPrefix);

  return `${countryPrefix} ${formattedNumber}`;
};
