export type CamelCase<S extends string> = S extends `${infer A}_${infer B}`
  ? `${Lowercase<A>}${Capitalize<B>}`
  : Lowercase<S>;

export type CameCaseObject<T extends Record<string, any>> = {
  // @ts-ignore
  [K in keyof T as CamelCase<K>]: T[K];
};

export const keysToCamelCase = <T extends Record<any, any>>(
  input: T
): CameCaseObject<T> =>
  Object.entries(input).reduce((acc, [key, value]) => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    return {
      ...acc,
      [camelCaseKey]: value,
    };
  }, {} as CameCaseObject<T>);

export type SnakeCase<S extends string> = S extends `${infer A}${infer B}`
  ? B extends Uncapitalize<B>
    ? `${Uncapitalize<A>}${SnakeCase<B>}`
    : `${Uncapitalize<A>}_${Uncapitalize<B>}`
  : S;

export type SnakeCaseObject<T extends Record<string, any>> = {
  // @ts-ignore
  [K in keyof T as SnakeCase<K>]: T[K];
};

export const keysToSnakeCase = <T extends Record<string, any>>(
  input: T
): SnakeCaseObject<T> =>
  Object.entries(input).reduce((acc, [key, value]) => {
    const snakeCaseKey = key
      .replace(/([a-z])([A-Z])/g, (_, lower, upper) => `${lower}_${upper}`)
      .toLowerCase();

    return {
      ...acc,
      [snakeCaseKey as keyof SnakeCaseObject<T>]: value,
    };
  }, {} as Partial<SnakeCaseObject<T>>) as unknown as SnakeCaseObject<T>;

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
