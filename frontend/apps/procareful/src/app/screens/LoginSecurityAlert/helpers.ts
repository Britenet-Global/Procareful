type ParsedMessage = {
  message: string;
  email: string | null;
  phone: string | null;
};

const checkNullishValue = (value: string) => value === 'null' || value === 'undefined';

export const parseMessage = (input: string): ParsedMessage | undefined => {
  const regex = /(.*?)(?:\[(.*?)\])(?: \[([^\]]+)\])?/;
  const match = input.toString().match(regex);

  if (match) {
    const message = match[1].trim();
    const email = checkNullishValue(match[2]) ? null : match[2];
    const phone = checkNullishValue(match[3]) ? null : match[3];

    return {
      message,
      email,
      phone,
    };
  }
};
