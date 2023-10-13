import { SERVICE_URL } from '@/config';
import type { JwtToken } from '@/types/auth';
import type {
  MultisigTransaction,
  RawMultisigTransaction,
} from '@/types/multisigTransaction';
import type { Paginated } from '@/types/response';
import { convertToQueryString } from '@/utils/api';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

export interface ListMultiCliqueTransactionsParams {
  search?: string;
  ordering?: keyof RawMultisigTransaction;
  limit: number;
  offset: number;
  xdr?: string;
  multicliqueAccountAddress?: string;
}

export interface CreateMultiCliqueTransactionRequestPayload {
  xdr: string;
}

export const createMultiCliqueTransaction = async (
  payload: CreateMultiCliqueTransactionRequestPayload,
  jwt: JwtToken
): Promise<MultisigTransaction> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(`${SERVICE_URL}/multiclique/transactions/`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt.access}`,
    },
  });

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const listMultiCliqueTransactions = async (
  params: ListMultiCliqueTransactionsParams,
  jwt: JwtToken
): Promise<Paginated<MultisigTransaction[]>> => {
  const queryString = convertToQueryString(keysToSnakeCase(params));

  // temp fix to address extra "_" in api params
  if (params?.multicliqueAccountAddress?.length) {
    queryString.set(
      'multiclique_account__address',
      params.multicliqueAccountAddress
    );
    queryString.delete('multiclique_account_address');
  }
  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/?${queryString}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.access}`,
      },
    }
  );

  const objResponse: Paginated<RawMultisigTransaction[]> =
    await response.json();

  const formattedResponse = {
    ...objResponse,
    results: objResponse.results?.map((data) => keysToCamelCase(data)),
  };

  return formattedResponse;
};

export const getMultiCliqueTransaction = async (id: string, jwt: JwtToken) => {
  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}/`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.access}`,
      },
    }
  );

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const updateMultiCliqueTransaction = async (
  id: string,
  payload: MultisigTransaction,
  jwt: JwtToken
): Promise<MultisigTransaction> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}`,
    {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.access}`,
      },
    }
  );

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const patchMultiCliqueTransaction = async (
  id: string,
  payload: Partial<MultisigTransaction>,
  jwt: JwtToken
): Promise<MultisigTransaction> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}/`,
    {
      method: 'PATCH',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.access}`,
      },
    }
  );

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const TransactionService = {
  createMultiCliqueTransaction,
  getMultiCliqueTransaction,
  updateMultiCliqueTransaction,
  listMultiCliqueTransactions,
  patchMultiCliqueTransaction,
};
