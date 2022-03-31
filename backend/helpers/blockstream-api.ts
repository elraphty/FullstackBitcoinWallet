import axios from 'axios';

axios.defaults.baseURL = 'https://blockstream.info/testnet/api';

import {
  Address,
  BlockstreamAPITransactionResponse,
  BlockstreamAPIUtxoResponse,
} from "../interfaces/blockstream";

export const getTransactionsFromAddress = async (
  address: Address
): Promise<BlockstreamAPITransactionResponse[]> => {
  const { data } = await axios.get(
    `/address/${address.address}/txs`
  );
  return data;
};

export const getUtxosFromAddress = async (
  address: Address
): Promise<BlockstreamAPIUtxoResponse[]> => {
  const { data } = await axios.get(
    `/address/${address.address}/utxo`
  );

  return data;
};

export const getTransactionHex = async (txid: string): Promise<string> => {
  const { data } = await axios.get(
    `/tx/${txid}/hex`
  );

  return data;
};

export const getFeeRates = async (): Promise<Object> => {
  const { data } = await axios.get(`/fee-estimates`);

  return data;
};

export const broadcastTx = async (txHex: string): Promise<string> => {
  const { data } = await axios.post(`/tx`, txHex);

  return data;
};
