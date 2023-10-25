import type { JwtToken } from '@/types/auth';
import type { Paginated } from '@/types/response';

export interface MockPolicyAssets {
  address: string;
  limit: number;
  spending: number;
}

export interface ListPolicyAssetsParams {
  search?: string;
  limit: number;
  offset: number;
  multicliqueAccountAddress?: string;
}

export const listPolicyAssets = async (
  params: ListPolicyAssetsParams,
  jwt: JwtToken
): Promise<Paginated<MockPolicyAssets[]>> => {
  //   const queryString = convertToQueryString(keysToSnakeCase(params));

  //   const response = await fetch(
  //     `${SERVICE_URL}/api/path/for/assets/?${queryString}`,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${jwt.access}`,
  //       },
  //     }
  //   );

  const mockResponse: MockPolicyAssets[] = await new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          Array(5)
            .fill(null)
            .map((v, i) => ({
              address: `Address ${i}`,
              limit: i,
              spending: i,
            }))
        ),
      1000
    );
  });

  //   const objResponse: Paginated<MockPolicyAssets[]> = await response.json();

  //   const formattedResponse = {
  //     ...objResponse,
  //     results: objResponse.results?.map((data) => keysToCamelCase(data)),
  //   };

  //   return formattedResponse;

  return {
    count: mockResponse.length,
    next: null,
    previous: null,
    results: mockResponse,
  };
};

export const AssetsService = {
  listPolicyAssets,
};
