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
  multicliqueAddress: string;
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
      'JWT Token': jwt.access,
    },
  });

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const listMultiCliqueTransactions = async (
  params: ListMultiCliqueTransactionsParams
): Promise<Paginated<MultisigTransaction[]>> => {
  const queryString = convertToQueryString(params);

  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/?${queryString}`
  );

  const objResponse: Paginated<RawMultisigTransaction[]> =
    await response.json();

  const formattedResponse = {
    ...objResponse,
    results: objResponse.results?.map((data) => keysToCamelCase(data)),
  };

  return formattedResponse;
};

export const getMultiCliqueTransaction = async (id: string) => {
  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}/`
  );

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const updateMultiCliqueTransaction = async (
  id: string,
  payload: MultisigTransaction
): Promise<MultisigTransaction> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}`,
    {
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const objResponse: RawMultisigTransaction = await response.json();

  const formattedMultiCliqueAccount = keysToCamelCase(objResponse);

  return formattedMultiCliqueAccount;
};

export const patchMultiCliqueTransaction = async (
  id: string,
  payload: Partial<MultisigTransaction>
): Promise<MultisigTransaction> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/transactions/${id}`,
    {
      method: 'PATCH',
      body,
      headers: {
        'Content-Type': 'application/json',
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
