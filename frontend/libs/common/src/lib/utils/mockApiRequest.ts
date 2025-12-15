export const createMockApiRequest = (successProbability: number, maxAttempts = 3) => {
  let attempts = 0;

  const mockApiRequest = (): Promise<boolean> =>
    new Promise(resolve => {
      if (maxAttempts && attempts + 1 > maxAttempts) {
        attempts = 0;
      }

      attempts++;

      if (Math.random() < successProbability) {
        attempts = 0;

        return resolve(true);
      }

      return resolve(false);
    });

  const getAttempts = () => attempts;

  return { mockApiRequest, getAttempts };
};
