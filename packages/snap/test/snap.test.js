import { installSnap } from '@metamask/snaps-jest'
import { isAddress } from 'ethers/lib/utils'
import { assert } from '@metamask/utils'
import { _BATCH_MOCK_MSG_, _MOCK_MSG_, _MOCK_ORIGIN_BATCH_TXS_, _MOCK_ORIGIN_TX_ } from './mock/signMessage'
import { panel, text } from '@metamask/snaps-ui'

const SNAP_ID = 'npm:@unipasswallet/unipass-snap'

describe('UniPass Snap', () => {
	let snap
	it('should Connect UniPass Snap', async () => {
		snap = await installSnap(SNAP_ID)
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
				text(
					`**Pay ${_MOCK_ORIGIN_TX_.transactions[0].amount} USDT on ${_MOCK_ORIGIN_TX_.chain}**`
				),
				text(`**To**: ${_MOCK_ORIGIN_TX_.transactions[0].to}`),
				text(
					`**Gasfee: ${_MOCK_ORIGIN_TX_.fee.amount} ${_MOCK_ORIGIN_TX_.fee.symbol}**`
				)
			])
		)
		await ui.ok();
		const result = await response
		expect(result.response.result).toBe('0xeea15d20c9672aeee32b7a145e0706d151166c76d8c92603aa6af20ba0df04a152dbf5941fc32b14aa3036fbf8e42a2dd46cd2c2bc3de87c6f05728f215e178d1c')
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
				text(
					`**Pay ${_MOCK_ORIGIN_TX_.transactions[0].amount} USDT on ${_MOCK_ORIGIN_TX_.chain}**`
				),
				text(`**To**: ${_MOCK_ORIGIN_TX_.transactions[0].to}`),
				text(
					`**Gasfee: ${_MOCK_ORIGIN_TX_.fee.amount} ${_MOCK_ORIGIN_TX_.fee.symbol}**`
				)
			])
		)
		await ui.ok();
		const result = await response
		expect(result.response.result).toBe('0xeea15d20c9672aeee32b7a145e0706d151166c76d8c92603aa6af20ba0df04a152dbf5941fc32b14aa3036fbf8e42a2dd46cd2c2bc3de87c6f05728f215e178d1c')
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
				text(`Pay ${_MOCK_ORIGIN_BATCH_TXS_.transactions[0].amount} USDT`),
				text(`To: ${_MOCK_ORIGIN_BATCH_TXS_.transactions[0].to}`),
				text(`**Payment 2**`),
				text(`Pay ${_MOCK_ORIGIN_BATCH_TXS_.transactions[1].amount} USDT`),
				text(`To: ${_MOCK_ORIGIN_BATCH_TXS_.transactions[1].to}`),
				text(
					`**Gasfee: ${_MOCK_ORIGIN_BATCH_TXS_.fee.amount} ${_MOCK_ORIGIN_BATCH_TXS_.fee.symbol}**`
				),
				text(`**Chain: ${_MOCK_ORIGIN_BATCH_TXS_.chain}**`)
			])
		)
		await ui.ok();
		const result = await response
		expect(result.response.result).toBe('0xd42909a5163e3364cba6488d64e0cb9914af902420b61adb1bf01b8afc761ac00dd62a39f14ef42bde7f99830c1a3cceee91cf6126e8dc795a5a0702a76124b91c')
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
		expect(result.loginMessage).toMatch(/^UniPass Snap is requesting to sign in at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z with your UniPass Snap account: 0xb8050c82D9bfb75f8a77cC4D5B36B4b7b850CEfb$/)
		expect(typeof result.loginSignature).toBe('string')
		expect(result.loginSignature.length).toBe(132)
	})
})
