import { SERVICE_URL } from '@/config';
import type { JwtToken, RawJwtToken } from '@/types/auth';
import { keysToCamelCase, keysToSnakeCase } from '@/utils/transformer';

interface CreateJwtRequestPayload {
  signature: string;
}

export const createJWT = async (
  address: string,
  payload: CreateJwtRequestPayload
): Promise<JwtToken> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/${address}/create-jwt-token/`,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const objResponse: RawJwtToken = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const refreshJWT = async (
  address: string,
  payload: CreateJwtRequestPayload
): Promise<JwtToken> => {
  const body = JSON.stringify(keysToSnakeCase(payload));

  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/${address}/refresh-jwt-token/`,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const objResponse: RawJwtToken = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const JwtService = {
  createJWT,
  refreshJWT,
};
