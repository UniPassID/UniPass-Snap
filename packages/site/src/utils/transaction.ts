import { SmartAccountResponse } from "@unipasswallet/smart-account";
import { updateHistory } from "./history";
import { TransactionStatus } from "@/types/transaction";
import { CHAIN_CONFIGS } from "@/constants";

export async function waitResponse(res: SmartAccountResponse, address: string, chainId: number) {
  try {
    await res.wait()
    updateHistory(address, chainId, res.hash, TransactionStatus.Success)
  } catch(e) {
    updateHistory(address, chainId, res.hash, TransactionStatus.Failed, JSON.stringify(e))
  }
}

export function getTokenByContractAddress(contractAddress: string) {
  for (let chain of CHAIN_CONFIGS) {
    return chain.tokens.find(token => token.contractAddress === contractAddress)
  }
}

export function getTokenBySymbol(symbol: string, chainId: number) {
  const chain = CHAIN_CONFIGS.find( chain => chain.chainId === chainId)
  
  if (chain) {
    return chain.tokens.find( token => token.symbol === symbol)
  }
}