import { SERVICE_URL } from '@/config';
import type { Multisig } from '@/types/multisig';
import type { Paginated } from '@/types/response';
import { convertToQueryString } from '@/utils/api';
import type { SnakeCaseObject } from '@/utils/transformer';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

export interface ListMultiCliqueAccountsParams {
  search?: string;
  ordering?: keyof Multisig;
  limit: number;
  offset: number;
  signatories?: string;
}

export interface CreateUpdateMultiCliqueAccountPayload {
  name: string;
  address: string;
  signatories: string[];
  defaultThreshold: number;
  policy: string;
}

export const createMultiCliqueAccount = async (
  payload: Multisig
): Promise<Multisig> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(`${SERVICE_URL}/multiclique/accounts/`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const objResponse: SnakeCaseObject<Multisig> = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const listMultiCliqueAccounts = async (
  params?: ListMultiCliqueAccountsParams
): Promise<Paginated<Multisig[]>> => {
  const queryString = convertToQueryString(params);

  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/?${queryString}`
  );

  const objResponse: Paginated<SnakeCaseObject<Multisig>[]> =
    await response.json();

  const formattedResponse: Paginated<Multisig[]> = {
    ...objResponse,
    results: objResponse.results.map((data) => keysToCamelCase(data)),
  };

  return formattedResponse;
};

export const AccountService = {
  createMultiCliqueAccount,
  listMultiCliqueAccounts,
};
