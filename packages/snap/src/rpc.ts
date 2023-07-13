import { Bytes, Wallet } from 'ethers'
import { SignTxMessageInput, OriginTransaction } from '../types'
import { NodeType, panel, text } from '@metamask/snaps-ui'
import { arrayify, entropyToMnemonic } from 'ethers/lib/utils'
import { getTokenSymbolByAddress, validTxHash } from './utils'

function getEntropy() {
	return snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})
}

async function getWallet() {
	const entropy = await getEntropy()
	const mnemonic = entropyToMnemonic(entropy)
	return Wallet.fromMnemonic(mnemonic)
}

export async function getMasterKeyAddress(): Promise<string> {
	const wallet = await getWallet()
	return wallet.address
}

export async function signMessage(message: string | Bytes): Promise<string> {
	const wallet = await getWallet()
	return wallet.signMessage(message)
}

export async function getAuthentication(address: string): Promise<{ loginMessage: string; loginSignature: string }> {
	const wallet = await getWallet()
	const loginMessage = `UniPass Snap is requesting to sign in at ${new Date().toISOString()} with your UniPass Snap account: ${address}`
	const loginSignature = await wallet.signMessage(loginMessage)
	return {
		loginMessage,
		loginSignature
	}
}

export async function signTransactionMessage(signTxMessage: SignTxMessageInput, origin: string) {
	let panelContent: { value: string; type: NodeType.Text }[]

	const originTransaction = JSON.parse(signTxMessage.originTransaction) as OriginTransaction

	const validHash = await validTxHash(originTransaction, signTxMessage.message)

	if (!validHash) {
		throw new Error('Invalid transaction hash')
	}

	if (originTransaction.transactions.length > 1) {
		let payContent = originTransaction.transactions.map((tx, index) => {
			return [
				text(`**Payment ${index + 1}**`),
				text(`Pay ${tx.amount} ${getTokenSymbolByAddress(tx.token)}`),
				text(`To: ${tx.to}`)
			]
		})
		panelContent = [
			...payContent.flat(),
			text(
				`**Gasfee: ${
					originTransaction.fee
						? `${originTransaction.fee.amount} ${getTokenSymbolByAddress(originTransaction.fee.token)}`
						: 'Free'
				}**`
			),
			text(`**Chain: ${originTransaction.chain}**`)
		]
	} else {
		panelContent = [
			text(
				`**Pay ${originTransaction.transactions[0].amount} ${getTokenSymbolByAddress(
					originTransaction.transactions[0].token
				)} on ${originTransaction.chain}**`
			),
			text(`**To: ${originTransaction.transactions[0].to}**`),
			text(
				`**Gasfee: ${
					originTransaction.fee
						? `${originTransaction.fee.amount} ${getTokenSymbolByAddress(originTransaction.fee.token)}`
						: 'Free'
				}**`
			)
		]
	}

	let result = await snap.request({
		method: 'snap_dialog',
		params: {
			type: 'confirmation',
			content: panel([...panelContent, text(`**URI: ${origin}**`)])
		}
	})

	if (result) return signMessage(arrayify(signTxMessage.message))
	throw new Error('User reject to sign transaction')
}
