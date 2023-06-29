import { SmartAccount } from '@unipasswallet/smart-account'
import { updateHistory } from './history'
import { Transaction, TransactionRecord, TransactionStatus } from '@/types/transaction'
import { CHAIN_CONFIGS } from '@/constants'
import { makeERC20Contract } from './make_contract'
import { getAddress } from 'ethers/lib/utils'
import { etherToWei } from './format'
import { upGA } from './ga4'

export async function waitPendingTransactions(
	smartAccount: SmartAccount,
	address: string,
	pendingTransactions: TransactionRecord[]
) {
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
			upGA('payment-success', 'payment', {
				BatchAmount: tx.txs.length,
				ChainID: tx.chainId,
				GasAmount: tx.fee?.amount,
				PaymentAmount: tx.txs.reduce((pre, tx) => pre + parseFloat(tx.amount) || 0, 0),
				SnapAddress: address,
				txHash: txResult.transactionHash
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
		return chain.tokens.find((token) => getAddress(token.contractAddress) === getAddress(contractAddress))
	}
}

export function getTokenBySymbol(symbol: string, chainId: number) {
	const chain = CHAIN_CONFIGS.find((chain) => chain.chainId === chainId)

	if (chain) {
		return chain.tokens.find((token) => token.symbol === symbol)
	}
}

export function formatTxs(txs: Transaction[]) {
	return  txs.map((tx) => {
		return formatTx(tx)
	})
}

export function formatTx(tx: Transaction) {
	const contract = makeERC20Contract(getAddress(tx.token))
	const data = contract.interface.encodeFunctionData('transfer', [
		getAddress(tx.to),
		etherToWei(tx.amount, getTokenByContractAddress(tx.token)?.decimals)
	])
	return { value: '0x00', to: getAddress(tx.token), data }
}
