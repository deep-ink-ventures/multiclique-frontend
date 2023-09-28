export const convertToQueryString = <T = Record<string, any>>(params: T) => {
  const query: Record<string, any> = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v != null)
  );

  const queryString = new URLSearchParams(query);

  return queryString;
};
