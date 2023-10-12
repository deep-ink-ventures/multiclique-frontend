import { SERVICE_URL } from '@/config';
import type {
  MultiCliqueAccount,
  RawMultiCliqueAccount,
} from '@/types/multiCliqueAccount';
import type { Paginated } from '@/types/response';
import { convertToQueryString } from '@/utils/api';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

export interface ListMultiCliqueAccountsParams {
  search?: string;
  ordering?: keyof RawMultiCliqueAccount;
  limit: number;
  offset: number;
  signatories?: string;
}

export const createMultiCliqueAccount = async (
  payload: MultiCliqueAccount
): Promise<MultiCliqueAccount> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(`${SERVICE_URL}/multiclique/accounts/`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const objResponse: RawMultiCliqueAccount = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const listMultiCliqueAccounts = async (
  params?: ListMultiCliqueAccountsParams
): Promise<Paginated<MultiCliqueAccount[]>> => {
  const queryString = convertToQueryString(params);

  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/?${queryString}`
  );

  const objResponse: Paginated<RawMultiCliqueAccount[]> = await response.json();

  const formattedResponse = {
    ...objResponse,
    results: objResponse.results.map((data) => keysToCamelCase(data)),
  };

  return formattedResponse;
};

export const getMultiCliqueAccount = async (address: string) => {
  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/${address}/`
  );

  const objResponse: RawMultiCliqueAccount = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const AccountService = {
  createMultiCliqueAccount,
  listMultiCliqueAccounts,
  getMultiCliqueAccount,
};
