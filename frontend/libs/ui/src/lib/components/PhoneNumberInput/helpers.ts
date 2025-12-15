type PhoneNumberParts = {
  countryCode: string;
  localNumber: string;
};

export const splitPhoneNumber = (fullPhoneNumber: string): PhoneNumberParts => {
  const [countryCode, ...localNumberParts] = fullPhoneNumber.split('-');
  const localNumber = localNumberParts.join('-');

  return { countryCode, localNumber };
};
