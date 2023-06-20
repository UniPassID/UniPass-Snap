import { SmartAccountResponse } from "@unipasswallet/smart-account";
import { updateHistory } from "./history";
import { TransactionStatus } from "@/types/transaction";
import { upNotify } from "@/components";

export async function waitResponse(res: SmartAccountResponse, address: string, chainId: number) {
  try {
    upNotify.waiting('Trading ...')
    await res.wait()
    updateHistory(address, chainId, res.hash, TransactionStatus.Success)
  } catch(e) {
    updateHistory(address, chainId, res.hash, TransactionStatus.Failed, JSON.stringify(e))
  }
}