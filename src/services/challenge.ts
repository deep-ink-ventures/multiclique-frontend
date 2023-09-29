import { SERVICE_URL } from '@/config';
import type { RawChallenge } from '@/types/auth';
import { keysToCamelCase } from '@/utils/transformer';

export const getChallenge = async (address: string) => {
  const response = await fetch(
    `${SERVICE_URL}/multiclique/accounts/${address}/challenge/`
  );

  const objResponse: RawChallenge = await response.json();

  const formattedResponse = keysToCamelCase(objResponse);

  return formattedResponse;
};

export const ChallengeService = {
  getChallenge,
};
