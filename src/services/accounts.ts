import { SERVICE_URL } from '@/config';
import type {
  MultiCliqueAccount,
  RawMultiCliqueAccount,
} from '@/types/multiCliqueAccount';
import type { Paginated } from '@/types/response';
import { convertToQueryString } from '@/utils/api';
import { keysToSnakeCase } from '@/utils/transformer';

export interface ListMultiCliqueAccountsParams {
  search?: string;
  ordering?: keyof RawMultiCliqueAccount;
  limit: number;
  offset: number;
  signatories?: string;
}

function convertRawMultiCliqueAccount(
  raw: RawMultiCliqueAccount
): MultiCliqueAccount {
  return {
    name: raw.name,
    address: raw.address,
    signatories: raw.signatories,
    defaultThreshold: raw.default_threshold,
    policy: {
      address: raw.policy.address,
      name: raw.policy.name,
      contracts: raw.policy.contracts
        ? raw.policy.contracts.map((contract) => ({
            address: contract.address,
            limit: contract.limit,
            alreadySpent: contract.already_spent,
            type: contract.type,
          }))
        : null,
    },
  };
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

  const formattedMultiCliqueAccount = convertRawMultiCliqueAccount(objResponse);

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
    results: objResponse.results.map((data) =>
      convertRawMultiCliqueAccount(data)
    ),
  };

  return formattedResponse;
};

export const getMultiCliqueAccount = async (address: string) => {
  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/${address}/`
  );

  const objResponse: RawMultiCliqueAccount = await response.json();

  const formattedResponse = convertRawMultiCliqueAccount(objResponse);

  return formattedResponse;
};

export const AccountService = {
  createMultiCliqueAccount,
  listMultiCliqueAccounts,
  getMultiCliqueAccount,
};
