import { SmartAccount, SmartAccountResponse } from '@unipasswallet/smart-account'
import { updateHistory } from './history'
import { TransactionRecord, TransactionStatus } from '@/types/transaction'
import { CHAIN_CONFIGS } from '@/constants'

export async function waitResponse(res: SmartAccountResponse, address: string, chainId: number) {
	try {
		const txResult = await res.wait()
		updateHistory({ address, chainId, relayerHash: res.hash, status: TransactionStatus.Success, hash: txResult.transactionHash })
	} catch (e) {
		updateHistory({
			address,
			chainId,
			relayerHash: res.hash,
			status: TransactionStatus.Failed,
			error: JSON.stringify(e)
		})
	}
}

export async function waitPendingTransactions(smartAccount: SmartAccount, address: string, pendingTransactions: TransactionRecord[]) {
	pendingTransactions.forEach(async (tx) => {
		try {
			const txResult = await smartAccount.waitTransactionByReceipt(tx.relayerHash, 1)
			updateHistory({
				address,
				chainId: tx.chainId,
				relayerHash: tx.relayerHash,
				status: txResult.status ? TransactionStatus.Success : TransactionStatus.Failed,
				hash: txResult.transactionHash
			})
		} catch (e) {
			updateHistory({
				address,
				chainId: tx.chainId,
				relayerHash: tx.relayerHash,
				status: TransactionStatus.Failed,
				error: e?.toString()
			})
		}
	})
}

export function getTokenByContractAddress(contractAddress: string) {
	for (let chain of CHAIN_CONFIGS) {
		return chain.tokens.find((token) => token.contractAddress === contractAddress)
	}
}

export function getTokenBySymbol(symbol: string, chainId: number) {
	const chain = CHAIN_CONFIGS.find((chain) => chain.chainId === chainId)

	if (chain) {
		return chain.tokens.find((token) => token.symbol === symbol)
	}
}
