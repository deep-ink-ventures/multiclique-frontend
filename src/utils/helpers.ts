import * as SorobanClient from 'soroban-client';

export const validateXDR = (xdrString: string, networkParaphrase: string) => {
  try {
    SorobanClient.TransactionBuilder.fromXDR(xdrString, networkParaphrase);
    return true;
  } catch (error) {
    return false;
  }
};
