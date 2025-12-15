export const formatConfirmationCode = (inputValue: string) => {
  const cleanValue = inputValue.replace(/\D+/g, '');
  if (cleanValue.length <= 3) return cleanValue;

  return `${cleanValue.slice(0, 3)}-${cleanValue.slice(3, 6)}`;
};

export const formatNumbersOnly = (inputValue: string | number, enableZero = false) => {
  const inputString = inputValue?.toString();
  const cleanedValue = inputString?.replace(/\D+/g, '');

  if (enableZero) {
    return cleanedValue;
  }

  const withoutLeadingZeros = cleanedValue?.replace(/^0+/, '');

  return withoutLeadingZeros;
};

type CountryFormat = {
  maxDigits: number;
  minDigits: number;
  format: (cleanValue: string) => string;
};

export const formatEuropeanPhoneNumber = (inputValue: string, countryPrefix: string) => {
  const cleanValue = inputValue.replace(/\D+/g, ''); // Remove non-numeric characters

  const formatWithSpaces = (parts: string[]) => parts.filter(Boolean).join(' ');

  const countryFormats: Record<string, CountryFormat> = {
    '+49': {
      maxDigits: 11,
      minDigits: 8,
      format: value => {
        const length = value.length;
        let areaCodeLength;

        // Determine area code length based on the current number of digits
        if (length === 11) {
          areaCodeLength = 4; // Use a 4-digit area code for 11 digits
        } else if (length === 10) {
          areaCodeLength = 3; // Use a 3-digit area code for 10 digits
        } else if (length === 9) {
          areaCodeLength = 2; // Use a 2-digit area code for 9 digits
        } else if (length === 8) {
          areaCodeLength = 2; // Use a 2-digit area code for 8 digits
        } else {
          return value; // Return the unformatted value if it's too short to format
        }

        // Handle cases where digits are being removed, or the number is incomplete
        const subscriberStart = areaCodeLength;
        const firstPartLength = length > subscriberStart + 3 ? 3 : length - subscriberStart;

        return formatWithSpaces([
          value.slice(0, areaCodeLength), // Area code part
          value.slice(subscriberStart, subscriberStart + firstPartLength), // First part of subscriber number
          value.slice(subscriberStart + firstPartLength), // Remaining part of the subscriber number
        ]);
      },
    },
    '+44': {
      maxDigits: 11,
      minDigits: 10,
      format: value => {
        if (value.length === 10) {
          // For landline numbers (10 digits)
          return formatWithSpaces([value.slice(0, 4), value.slice(4, 7), value.slice(7)]);
        } else if (value.length === 11) {
          // For mobile numbers (11 digits)
          return formatWithSpaces([value.slice(0, 5), value.slice(5, 8), value.slice(8)]);
        }

        return value;
      },
    },
    '+385': {
      maxDigits: 9,
      minDigits: 8,
      format: value => {
        let areaCodeLength = 0;

        // Determine area code length based on the number of digits
        if (value.length === 9) {
          areaCodeLength = 2; // Use 2-digit area code for 9-digit numbers
        } else if (value.length === 8) {
          areaCodeLength = 1; // Use 1-digit area code for 8-digit numbers
        }

        return formatWithSpaces([
          value.slice(0, areaCodeLength), // Area code part (1 or 2 digits)
          value.slice(areaCodeLength, areaCodeLength + 3), // First part of the subscriber number
          value.slice(areaCodeLength + 3), // Remaining part of the subscriber number
        ]);
      },
    },
    '+36': {
      maxDigits: 9,
      minDigits: 8,
      format: value => {
        const areaCodeLength = value.length === 9 ? 2 : 1; // Use 2-digit area code for 9 digits, 1-digit for 8 digits

        return formatWithSpaces([
          value.slice(0, areaCodeLength), // Area code part (1 or 2 digits)
          value.slice(areaCodeLength, areaCodeLength + 3), // First part of the subscriber number
          value.slice(areaCodeLength + 3), // Remaining part of the subscriber number
        ]);
      },
    },
    '+39': {
      maxDigits: 12,
      minDigits: 6,
      format: value => {
        const areaCodeLength = value.length >= 11 ? 4 : value.length >= 9 ? 3 : 2; // Dynamic area code length based on total digits

        return formatWithSpaces([
          value.slice(0, areaCodeLength), // Area code part (2 to 4 digits)
          value.slice(areaCodeLength, areaCodeLength + 3), // First part of subscriber number
          value.slice(areaCodeLength + 3), // Remaining subscriber number
        ]);
      },
    },
    '+48': {
      maxDigits: 9,
      minDigits: 9,
      format: value => formatWithSpaces([value.slice(0, 3), value.slice(3, 6), value.slice(6)]),
    },
    '+386': {
      maxDigits: 8,
      minDigits: 8,
      format: value => {
        const areaCodeLength = 2; // Slovenia typically uses 2-digit area codes

        return formatWithSpaces([
          value.slice(0, areaCodeLength), // Area code part (2 digits)
          value.slice(areaCodeLength, areaCodeLength + 3), // First part of the subscriber number
          value.slice(areaCodeLength + 3), // Remaining part of the subscriber number
        ]);
      },
    },
  };

  const countryFormat = countryFormats[countryPrefix];

  if (countryFormat) {
    const truncatedValue = cleanValue.slice(0, countryFormat.maxDigits);

    return countryFormat.format(truncatedValue);
  }

  return inputValue;
};
