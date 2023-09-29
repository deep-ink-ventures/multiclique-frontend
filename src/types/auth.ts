import type { CamelCaseObject } from '@/utils/transformer';

export interface RawChallenge {
  challenge: string;
}

export type Challenge = CamelCaseObject<RawChallenge>;

export interface RawJwtToken {
  access: string;
  refresh: string;
}

export type JwtToken = CamelCaseObject<RawJwtToken>;
