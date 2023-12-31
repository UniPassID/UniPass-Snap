import { GetSnapsResponse, Snap } from '@/types'
import { Bytes } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { OriginTransaction } from '@/types/transaction'

const defaultSnapOrigin = process.env.REACT_APP_SNAP_ORIGIN as string
const version = process.env.REACT_APP_SNAP_VERSION

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
export const connectSnap = async () => {
	// @ts-ignore
	await window.ethereum.request({
		method: 'wallet_requestSnaps',
		params: {
			[defaultSnapOrigin]: { version }
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
		const snaps = await getSnaps()
		return Object.values(snaps).find((snap) => {
			return snap.id === defaultSnapOrigin && (!version || snap.version === version)
		})
	} catch (e) {
		console.log('Failed to obtain installed snap', e)
		return undefined
	}
}

export const getMasterKeyAddress = async () => {
	// @ts-ignore
	return (await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'getMasterKeyAddress' } }
	})) as string
}

export const signMessageWithSnap = async (message: string | Bytes, originTransaction?: OriginTransaction) => {
	// @ts-ignore
	return (await window.ethereum.request<string>({
		method: 'wallet_invokeSnap',
		params: {
			snapId: defaultSnapOrigin,
			request: { method: 'signMessage', params: { message, originTransaction: JSON.stringify(originTransaction) } }
		}
	})) as string
}

export const getAuthentication = async (address: string) => {
	// @ts-ignore
	return await window.ethereum.request<{ loginMessage: string; loginSignature: string }>({
		method: 'wallet_invokeSnap',
		params: { snapId: defaultSnapOrigin, request: { method: 'getAuthentication', params: { address } } }
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
