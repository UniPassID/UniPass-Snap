import { Interface, getAddress, parseUnits } from 'ethers/lib/utils'
import { Transaction, OriginTransaction, FeeTx } from '../../types'
import { BigNumber, Contract, constants } from 'ethers'
import { ERC20_ABI } from './ERC20_ABI'
import { ModuleMainInterface } from '@unipasswallet/utils'
import { RawMainExecuteCall } from '@unipasswallet/wallet/dist/rawMainExecuteCall'
import { CallTxBuilder } from '@unipasswallet/transaction-builders'
import { digestTxHash, toTransaction, Transactionish, Transaction as UPTransaction } from '@unipasswallet/transactions'

export const POLYGON_MUMBAI_USDC_ADDRESS = '0x87F0E95E11a49f56b329A1c143Fb22430C07332a'
export const POLYGON_MUMBAI_USDT_ADDRESS = '0x569F5fF11E259c8e0639b4082a0dB91581a6b83e'

export const POLYGON_MAINNET_USDC_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
export const POLYGON_MAINNET_USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'

export const ARBITRUM_MAINNET_USDC_ADDRESS = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
export const ARBITRUM_MAINNET_USDT_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'

export const TOKEN_SYMBOL_MAP: Record<string, string> = {
	[getAddress(POLYGON_MUMBAI_USDC_ADDRESS)]: 'USDC',
	[getAddress(POLYGON_MUMBAI_USDT_ADDRESS)]: 'USDT',
	[getAddress(POLYGON_MAINNET_USDC_ADDRESS)]: 'USDC',
	[getAddress(POLYGON_MAINNET_USDT_ADDRESS)]: 'USDT',
	[getAddress(ARBITRUM_MAINNET_USDC_ADDRESS)]: 'USDC',
	[getAddress(ARBITRUM_MAINNET_USDT_ADDRESS)]: 'USDT'
}

export function getTokenSymbolByAddress(address: string) {
	return TOKEN_SYMBOL_MAP[getAddress(address)]
}

export function formatTxs(txs: Transaction[]) {
	return txs.map((tx) => {
		return formatTx(tx)
	})
}

export function formatTx(tx: Transaction) {
	const contract = new Contract(getAddress(tx.token), ERC20_ABI)
	const data = contract.interface.encodeFunctionData('transfer', [getAddress(tx.to), parseUnits(tx.amount, 6)])
	return { value: '0x00', to: getAddress(tx.token), data }
}

async function generateExecuteCall(
	txs: UPTransaction[],
	nonce: BigNumber,
	address: string,
	feeTx?: UPTransaction
): Promise<RawMainExecuteCall> {
	const transactions = []
	const OWNER_WEIGHT = 100
	const GUARDIAN_WEIGHT = 0
	const ASSETS_OP_WEIGHT = 100

	if (txs.length === 1) {
		transactions.push(txs[0])
	} else {
		const data = ModuleMainInterface.encodeFunctionData('selfExecute', [
			OWNER_WEIGHT,
			ASSETS_OP_WEIGHT,
			GUARDIAN_WEIGHT,
			txs
		])

		transactions.push(new CallTxBuilder(true, constants.Zero, address, constants.Zero, data).build())
	}

	if (feeTx) {
		transactions.push(feeTx)
	}

	return new RawMainExecuteCall(transactions, nonce.add(1), [0])
}

function feeFormatter(feeTx?: Transaction): FeeTx | undefined {
	return feeTx ? { ...feeTx, amount: parseUnits(feeTx.amount, 6) } : undefined
}

function generateFeeTx(fee?: FeeTx): UPTransaction | undefined {
	if (fee) {
		const { to, amount, token } = fee

		if (amount.gt(0)) {
			if (token === constants.AddressZero) {
				return new CallTxBuilder(true, constants.Zero, to, amount, '0x').build()
			}

			return new CallTxBuilder(
				true,
				constants.Zero,
				token,
				constants.Zero,
				new Interface(ERC20_ABI).encodeFunctionData('transfer', [to, amount])
			).build()
		}
	}

	return undefined
}

export async function validTxHash(originTransaction: OriginTransaction, digestHash: string): Promise<boolean> {
	try {
		const txs = formatTxs(originTransaction.transactions)
		const newTxs = txs.map((tx) => {
			const newTx = Object.assign({}, tx as Transactionish)
			newTx.gasLimit = constants.Zero
			const callTx = toTransaction(newTx)
			callTx.revertOnError = true
			return toTransaction(callTx)
		})

		const execute = await generateExecuteCall(
			newTxs,
			BigNumber.from(originTransaction.nonce),
			originTransaction.address,
			generateFeeTx(feeFormatter(originTransaction.fee))
		)
		const txHash = digestTxHash(
			originTransaction.chainId,
			originTransaction.address,
			originTransaction.nonce,
			execute.txs
		)
		return txHash === digestHash
	} catch (e) {
		return false
	}
}
