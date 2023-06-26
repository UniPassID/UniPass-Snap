import { utils } from 'ethers'
import { useAsyncEffect } from 'ahooks'
import { useRecoilState } from 'recoil'
import { flaskState, installedSnapState, smartAccountState, smartAccountInsState } from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isFlaskVersion } from '@/utils'
import { CHAIN_CONFIGS, CUSTOM_AUTH_APPID } from '@/constants'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'
import { SnapSigner } from '@/snap-signer'
import { fetchAccessToken } from '@/utils/account'

export const useSnap = () => {
	const [isFlask, setHasFlaskDetected] = useRecoilState(flaskState)
	const [installedSnap, setInstalledSnap] = useRecoilState(installedSnapState)
	const [, setSmartAccountState] = useRecoilState(smartAccountState)
	const [, setSmartAccountInsState] = useRecoilState(smartAccountInsState)

	useAsyncEffect(async () => {
		const _isFlask = await isFlaskVersion()
		console.log(`_isFlask: ${_isFlask}`)

		setHasFlaskDetected(_isFlask)
		if (_isFlask) {
			const localSmartAccountAddress = window.localStorage.getItem('up__smartAccountAddress')

			if (localSmartAccountAddress && utils.isAddress(localSmartAccountAddress)) {
				setSmartAccountState(localSmartAccountAddress)
				setInstalledSnap(await getSnap())
			}
		}
	}, [])

	const handleConnectSnap = async () => {
		try {
			await connectSnap()
			setInstalledSnap(await getSnap())
			upNotify.success('connect success')
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	useAsyncEffect(async () => {
		if (installedSnap) {
			try {
				const masterKeyAddress = await getMasterKeyAddress()
				const signer = new SnapSigner(masterKeyAddress)
				const smartAccount = new SmartAccount({
					chainOptions: CHAIN_CONFIGS,
					masterKeySigner: signer,
					appId: CUSTOM_AUTH_APPID
				})
				await smartAccount.init({ chainId: CHAIN_CONFIGS[0].chainId })
				const address = await smartAccount.getAddress()
				const smartAccountAddress = utils.getAddress(address)
				window.localStorage.setItem('up__smartAccountAddress', smartAccountAddress)
				setSmartAccountState(smartAccountAddress)
				setSmartAccountInsState(smartAccount)
				fetchAccessToken({
					accountAddress: smartAccountAddress,
					providerIdentifier: masterKeyAddress
				})
			} catch (e: any) {
				upNotify.error(e.message)
			}
		}
	}, [installedSnap])

	return { isFlask, installedSnap, handleConnectSnap }
}
