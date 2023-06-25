import { OnRpcRequestHandler } from '@metamask/snaps-types'
import { panel, text } from '@metamask/snaps-ui'
import { getMasterKeyAddress, getSignSig, signMessage } from './rpc'
import { arrayify, hexlify } from 'ethers/lib/utils'
import { SignInput } from '../types'

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
		case 'hello':
			return snap.request({
				method: 'snap_dialog',
				params: {
					type: 'confirmation',
					content: panel([
						text(`Hello, **${origin}**!`),
						text('This custom confirmation is just for display purposes.'),
						text('But you can edit the snap source code to make it do something, if you want to!')
					])
				}
			})
		case 'getMasterKeyAddress':
			return getMasterKeyAddress()
		case 'signMessage':
			await snap.request({
				method: 'snap_dialog',
				params: {
					type: 'confirmation',
					content: panel([text(`Hello, **${origin}**!`), text((request.params as any).message)])
				}
			})
			return signMessage(arrayify((request.params as any).message))
		case 'getSignSig':
			return getSignSig((request.params! as SignInput).address)
		default:
			throw new Error('Method not found.')
	}
}
