import { GetSnapsResponse, Snap } from '@/types'
import { Bytes } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { originTransaction } from '@/types/transaction'

const defaultSnapOrigin = process.env.REACT_APP_SNAP_ORIGIN as string

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
	// @ts-ignore
	return (await window.ethereum.request({
		method: 'wallet_getSnaps'
	})) as unknown as GetSnapsResponse
}

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
	snapId: string = defaultSnapOrigin,
	params: Record<'version' | string, unknown> = {}
) => {
	// @ts-ignore
	await window.ethereum.request({
		method: 'wallet_requestSnaps',
		params: {
			[snapId]: params
		}
	})
}

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (): Promise<Snap | undefined> => {
	try {
		const version = process.env.REACT_APP_SNAP_VERSION
		const snaps = await getSnaps()
		return Object.values(snaps).find((snap) => {
			return snap.id === defaultSnapOrigin && (!version || snap.version === version)
		})
	} catch (e) {
		console.log('Failed to obtain installed snap', e)
		return undefined
	}
}

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
	// @ts-ignore
	await window.ethereum.request({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'hello' } }
	})
}

export const getMasterKeyAddress = async () => {
	// @ts-ignore
	return (await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'getMasterKeyAddress' } }
	})) as string
}

export const signMessageWithSnap = async (message: string | Bytes, originTransaction?: originTransaction) => {
	// @ts-ignore
	return (await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'signMessage', params: { message, originTransaction: JSON.stringify(originTransaction) } } }
	})) as string
}

export const getSignSig = async (address: string) => {
	// @ts-ignore
	return await window.ethereum.request<{ loginMessage: string; loginSignature: string }>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'getSignSig', params: { address } } }
	})
}

export const signTransactionWithSnap = async (transaction: TransactionRequest) => {
	// @ts-ignore
	return (await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'signTransaction', params: { transaction } } }
	})) as string
}

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:')
