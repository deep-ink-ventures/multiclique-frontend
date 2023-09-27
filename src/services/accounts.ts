import { SERVICE_URL } from '@/config';
import type { MultiCliqueAccount } from '@/types/multisig';
import type { Paginated } from '@/types/response';
import { convertToQueryString } from '@/utils/api';
import type { SnakeCaseObject } from '@/utils/transformer';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

export interface ListMultiCliqueAccountsParams {
  search?: string;
  ordering?: keyof MultiCliqueAccount;
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

export const createUpdateMultiCliqueAccount = async (
  payload: CreateUpdateMultiCliqueAccountPayload
): Promise<MultiCliqueAccount> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(`${SERVICE_URL}/multiclique/accounts/`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const objResponse: SnakeCaseObject<MultiCliqueAccount> =
    await response.json();

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

  const objResponse: Paginated<SnakeCaseObject<MultiCliqueAccount>[]> =
    await response.json();

  const formattedResponse: Paginated<MultiCliqueAccount[]> = {
    ...objResponse,
    results: objResponse.results.map((data) => keysToCamelCase(data)),
  };

  return formattedResponse;
};

export const AccountService = {
  createUpdateMultiCliqueAccount,
  listMultiCliqueAccounts,
};
