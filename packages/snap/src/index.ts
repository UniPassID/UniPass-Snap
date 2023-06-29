import { OnRpcRequestHandler } from '@metamask/snaps-types'
import { panel, text } from '@metamask/snaps-ui'
import { getMasterKeyAddress, getSignSig, signTransactionMessage } from './rpc'
import { SignInput, SignTxMessageInput } from '../types'

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
	switch (request.method) {
		case 'getMasterKeyAddress':
			return getMasterKeyAddress()
		case 'signMessage':
			return signTransactionMessage(request.params as SignTxMessageInput)
		case 'getSignSig':
			return getSignSig((request.params as SignInput).address)
		default:
			throw new Error('Method not found.')
	}
}
