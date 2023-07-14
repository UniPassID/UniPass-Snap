import { installSnap } from '@metamask/snaps-jest'
import { isAddress } from 'ethers/lib/utils'
import { assert } from '@metamask/utils'
import {
	_BATCH_MOCK_MSG_,
	_MOCK_MSG_,
	_MOCK_MSG_FREE_,
	_MOCK_ORIGIN_BATCH_TXS_,
	_MOCK_ORIGIN_TX_,
	_MOCK_ORIGIN_TX_FREE_,
	_MODIFIED_TX_HASH_
} from './mock/signMessage'
import { panel, text } from '@metamask/snaps-ui'

describe('UniPass Snap', () => {
	let snap
	it('should Connect UniPass Snap', async () => {
		snap = await installSnap()
	})

	it('Can get masterKey address', async () => {
		const { request } = snap
		const response = await request({
			origin: 'https://snap.unipass.xyz',
			method: 'getMasterKeyAddress'
		})
		const { result } = response.response
		expect(isAddress(result)).toBe(true)
	})

	it('Can sign free single transaction message', async () => {
		const { request } = snap
		const response = request({
			origin: 'https://snap.unipass.xyz',
			method: 'signMessage',
			params: {
				message: _MOCK_MSG_FREE_,
				originTransaction: JSON.stringify(_MOCK_ORIGIN_TX_FREE_)
			}
		})
		const ui = await response.getInterface()
		assert(ui.type === 'confirmation')
		expect(ui).toRender(
			panel([
				text(`**Pay 1 USDT on Mumbai**`),
				text(`**To**: 0x26441AC58f27536eF40fFD0D76c4fA9C96c9F398`),
				text(`**Gasfee: Free**`)
			])
		)
		await ui.ok()
		const result = await response
		expect(typeof result.response.result).toBe('string')
	})

	it('Can sign single transaction message', async () => {
		const { request } = snap
		const response = request({
			origin: 'https://snap.unipass.xyz',
			method: 'signMessage',
			params: {
				message: _MOCK_MSG_,
				originTransaction: JSON.stringify(_MOCK_ORIGIN_TX_)
			}
		})
		const ui = await response.getInterface()
		assert(ui.type === 'confirmation')
		expect(ui).toRender(
			panel([
				text(`**Pay 1 USDT on Mumbai**`),
				text(`**To**: 0x26441AC58f27536eF40fFD0D76c4fA9C96c9F398`),
				text(`**Gasfee: 0.012 USDT**`)
			])
		)
		await ui.ok()
		const result = await response
		expect(typeof result.response.result).toBe('string')
	})

	it('Can sign batch transactions message', async () => {
		const { request } = snap
		const response = request({
			origin: 'https://snap.unipass.xyz',
			method: 'signMessage',
			params: {
				message: _BATCH_MOCK_MSG_,
				originTransaction: JSON.stringify(_MOCK_ORIGIN_BATCH_TXS_)
			}
		})
		const ui = await response.getInterface()
		assert(ui.type === 'confirmation')
		expect(ui).toRender(
			panel([
				text(`**Payment 1**`),
				text(`Pay 1 USDT`),
				text(`To: 0x26441AC58f27536eF40fFD0D76c4fA9C96c9F398`),
				text(`**Payment 2**`),
				text(`Pay 1 USDT`),
				text(`To: 0x26441AC58f27536eF40fFD0D76c4fA9C96c9F398`),
				text(`**Gasfee: 0.012 USDT**`),
				text(`**Chain: Mumbai**`)
			])
		)
		await ui.ok()
		const result = await response
		expect(typeof result.response.result).toBe('string')
	})

	it('Verify signed message and originTransaction', async () => {
		const { request } = snap
		const response = await request({
			origin: 'https://snap.unipass.xyz',
			method: 'signMessage',
			params: {
				message: _MODIFIED_TX_HASH_,
				originTransaction: JSON.stringify(_MOCK_ORIGIN_TX_)
			}
		})
		expect(response).toRespondWithError({
			code: -32603,
			message: 'Internal JSON-RPC error.',
			data: {
				cause: {
					message: 'Invalid transaction hash',
					stack: expect.any(String)
				}
			}
		})
	})

	it('Can get authentication', async () => {
		const { request } = snap
		const response = await request({
			origin: 'https://snap.unipass.xyz',
			method: 'getAuthentication',
			params: {
				address: '0xb8050c82D9bfb75f8a77cC4D5B36B4b7b850CEfb'
			}
		})
		const { result } = response.response
		expect(result.loginMessage).toMatch(
			/^UniPass Snap is requesting to sign in at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z with your UniPass Snap account: 0xb8050c82D9bfb75f8a77cC4D5B36B4b7b850CEfb$/
		)
		expect(typeof result.loginSignature).toBe('string')
		expect(result.loginSignature.length).toBe(132)
	})
})
