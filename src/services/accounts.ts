import { SERVICE_URL } from '@/config';
import type { MultiCliqueAccount } from '@/types/multisig';
import type { SnakeCaseObject } from '@/utils/transformer';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

export interface CreateUpdateMultiCliqueAccountPayload {
  address: string;
  publicKeys: string[];
  defaultThreshold: number;
  policy: string;
}

export const createUpdateMultiCliqueAccount = async (
  payload: CreateUpdateMultiCliqueAccountPayload
): Promise<MultiCliqueAccount> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(`${SERVICE_URL}/multiclique/accounts`, {
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

export const AccountService = {
  createUpdateMultiCliqueAccount,
};
