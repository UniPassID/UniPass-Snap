import { SmartAccountResponse } from "@unipasswallet/smart-account";
import { updateHistory } from "./history";
import { TransactionStatus } from "@/types/transaction";
import { upNotify } from "@/components";
import { CHAIN_CONFIGS } from "@/constants";

export async function waitResponse(res: SmartAccountResponse, address: string, chainId: number) {
  try {
    upNotify.waiting('Trading ...')
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