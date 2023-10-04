import { SERVICE_URL } from '@/config';
import type { ElioConfig, RawElioConfig } from '@/types/elioConfig';
import { keysToCamelCase } from '@/utils/transformer';

export const getConfig = async () => {
  const response = await fetch(`${SERVICE_URL}/config/`);

  const objResponse: RawElioConfig = await response.json();

  const formattedResponse = keysToCamelCase(
    objResponse
  ) as unknown as ElioConfig;

  return formattedResponse;
};

export const ConfigService = {
  getConfig,
};
