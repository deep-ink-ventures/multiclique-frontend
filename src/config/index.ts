import BigNumber from 'bignumber.js';

/** 18 decimals */
export const DAO_UNITS: BigNumber = BigNumber(1000000000000000000);

/** Block time in seconds */
export const BLOCK_TIME: number = 5;

/** 7 decimals */
export const XLM_UNITS: BigNumber = BigNumber(10000000);

/** In XLM */
export const BASE_FEE: string = '100';

enum Network {
  Futurenet = 'FUTURENET',
  Standalone = 'STANDALONE',
  Pubnet = 'PUBNET',
}

export const NETWORK_PASSPHRASE: { [key in Network]: string } = {
  FUTURENET: 'Test SDF Future Network ; October 2022',
  STANDALONE: 'Standalone Network ; February 2017',
  PUBNET: 'Public Global Stellar Network ; September 2015',
};

export const SOROBAN_RPC_ENDPOINT: { [key in Network]: string } = {
  FUTURENET: 'https://rpc-futurenet.stellar.org',
  STANDALONE: 'https://node.elio-dao.org/soroban/rpc',
  PUBNET: 'https://horizon.stellar.org',
};

export const SERVICE_URL: Readonly<string> = 'https://service.elio-dao.org';
