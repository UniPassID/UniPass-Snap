import { defaultSnapOrigin } from '@/constants'
import { GetSnapsResponse, Snap } from '@/types'
import { Bytes } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
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
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
	try {
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
	await window.ethereum.request({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'hello' } }
	})
}

export const getMasterKeyAddress = async () => {
	return await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'getMasterKeyAddress' } }
	}) as string
}

export const signMessageWithSnap = async (message: string | Bytes) => {
	return await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'signMessage', params: { message } } }
	}) as string
}

export const signTransactionWithSnap = async (transaction: TransactionRequest) => {
	return await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'signTransaction', params: { transaction } } }
	}) as string
}

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:')
