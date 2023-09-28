import { SERVICE_URL } from '@/config';
import type { Multisig } from '@/types/multisig';
import type { SnakeCaseObject } from '@/utils/transformer';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

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

export const AccountService = {
  createMultiCliqueAccount,
};
