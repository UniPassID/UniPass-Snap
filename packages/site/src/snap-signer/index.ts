import { originTransaction } from "@/types/transaction";
import { signMessageWithSnap, signTransactionWithSnap } from "@/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Bytes, Signer } from "ethers"; 
import { hexlify } from "ethers/lib/utils";

export class SnapSigner extends Signer {
  private address: string
  private originTransaction?: originTransaction

  constructor(address: string) {
    super()
    this.address = address
  }
  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }

  async signMessage(message: string | Bytes): Promise<string> {
    const sig = await signMessageWithSnap(hexlify(message), this.originTransaction)
    this.originTransaction = undefined
    return sig
  }

  signTransaction(transaction: TransactionRequest): Promise<string> {
    return signTransactionWithSnap(transaction)
  }

  setOriginTransaction(originTransaction: originTransaction) {
    this.originTransaction = originTransaction
  }

  connect() {
    return this
  }
}