import { signMessageWithSnap, signTransactionWithSnap } from "@/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Bytes, Signer } from "ethers"; 
import { hexlify } from "ethers/lib/utils";

export class SnapSigner extends Signer {
  private address: string

  constructor(address: string) {
    super()
    this.address = address
  }
  getAddress(): Promise<string> {
    return Promise.resolve(this.address)
  }

  async signMessage(message: string | Bytes): Promise<string> {
    return await signMessageWithSnap(hexlify(message))
  }

  signTransaction(transaction: TransactionRequest): Promise<string> {
    return signTransactionWithSnap(transaction)
  }

  connect() {
    return this
  }
}