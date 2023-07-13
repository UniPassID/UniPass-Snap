import { Bytes, Wallet } from 'ethers'
import { SignTxMessageInput, OriginTransaction } from '../types'
import { NodeType, panel, text } from '@metamask/snaps-ui'
import { arrayify } from 'ethers/lib/utils'
import { getTokenSymbolByAddress, validTxSig } from './utils'

function getEntropy() {
	return snap.request({
		method: 'snap_getEntropy',
		params: {
			version: 1
		}
	})
}

export async function getMasterKeyAddress(): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).address
}

export async function signMessage(message: string | Bytes): Promise<string> {
	const entropy = await getEntropy()
	return new Wallet(entropy).signMessage(message)
}

export async function getAuthentication(address: string): Promise<{ loginMessage: string; loginSignature: string }> {
	const entropy = await getEntropy()
	const loginMessage = `UniPass Snap is requesting to sign in at ${new Date().toISOString()} with your UniPass Snap account: ${address}`
	const loginSignature = await new Wallet(entropy).signMessage(loginMessage)
	return {
		loginMessage,
		loginSignature
	}
}

export async function signTransactionMessage(signTxMessage: SignTxMessageInput) {
	let panelContent: { value: string; type: NodeType.Text }[]

	const originTransaction = JSON.parse(signTxMessage.originTransaction) as OriginTransaction

	if (!validTxSig(originTransaction, signTxMessage.message)) {
		throw new Error('inValid transaction sig')
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
			text(`**To**: ${originTransaction.transactions[0].to}`),
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
			content: panel(panelContent)
		}
	})

	if (result) return signMessage(arrayify(signTxMessage.message))
	throw new Error('User reject to sign transaction')
}
