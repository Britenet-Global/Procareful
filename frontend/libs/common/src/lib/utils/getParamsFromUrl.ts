type DecodedParams = { [key: string]: string };

export const getParamsFromURL = (url: string): DecodedParams =>
  Object.fromEntries(
    Array.from(new URL(url).searchParams.entries()).map(([key, value]) => [
      key,
      decodeURIComponent(value),
    ])
  );
