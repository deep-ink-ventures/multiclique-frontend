import { DAO_UNITS, XLM_UNITS } from '@/config';
import BigNumber from 'bignumber.js';
import * as SorobanClient from 'soroban-client';
// @ts-ignore
export const truncateMiddle = (str: string, start = 4, end = 4) => {
  if (str && str.length > 0) {
    if (str.length <= start + end) {
      return str;
    }
    return `${str.substring(0, start)}...${
      end > 0 ? str.substring(str.length - end) : ''
    }`;
  }
  return '';
};

// eslint-disable-next-line
export const uiTokens = (
  rawAmount: BigNumber | null,
  tokenType?: 'xlm' | 'dao',
  unitName?: string
) => {
  const units = tokenType === 'xlm' ? XLM_UNITS : DAO_UNITS;
  const fmt = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
  };

  BigNumber.config({ FORMAT: fmt });
  const formatted = rawAmount
    ? rawAmount.dividedBy(units).toFormat(0)
    : new BigNumber(0)?.toFormat(0);

  return `${formatted} ${unitName}`;
};

export const isValidEd25519PublicKey = (publicKey: string) => {
  return SorobanClient.StrKey.isValidEd25519PublicKey(publicKey);
};

// fixme add more val type decoders
export const decodeXdr = (xdr: string) => {
  const scVal = SorobanClient.xdr.ScVal.fromXDR(xdr as string, 'base64');
  switch (scVal.switch().name) {
    case 'scvAddress':
      return SorobanClient.Address.fromScAddress(scVal.address()).toString();
    case 'scvBytes':
      return scVal.bytes().toString();
    case 'scvMap':
      return scVal.map()?.map((item) => {
        if (item.val().switch().name === 'scvBytes') {
          return item.val().bytes().toString();
        }
        if (item.val().switch().name === 'scvAddress') {
          SorobanClient.Address.fromScAddress(item.val().address());
          return SorobanClient.Address.fromScAddress(
            item.val().address()
          ).toString();
        }
        return item;
      });
    case 'scvU32':
      return scVal.u32();
    default: {
      const val = SorobanClient.scValToNative(scVal);
      return val;
    }
  }
};

export const splitCamelCase = (str: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const currentChar = str[i];
    if (currentChar === currentChar?.toUpperCase()) {
      result += ' ';
    }
    result += currentChar;
  }
  return result.trim();
};

export const numberToU32ScVal = (number: number) => {
  return SorobanClient.xdr.ScVal.scvU32(Number(number));
};

export const toBase64 = (str: string): string => {
  return Buffer.from(str, 'utf-8').toString('base64');
};

export const accountToScVal = (account: string) =>
  new SorobanClient.Address(account).toScVal();

export const isValidXDR = (xdrString: string, networkParaphrase: string) => {
  try {
    SorobanClient.TransactionBuilder.fromXDR(xdrString, networkParaphrase);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidBase64String = (str: string) => {
  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(str);
};
