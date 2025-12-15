export const formatStringToPdf = (input: string) => {
  const trimmedInput = input.trim();
  const dashSeparated = trimmedInput.replace(/\s+/g, '-');
  const formattedString = `${dashSeparated}.pdf`;

  return formattedString;
};
