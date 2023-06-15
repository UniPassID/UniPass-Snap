import { utils } from 'ethers'
import { useAsyncEffect } from 'ahooks'
import { useRecoilState } from 'recoil'
import { flaskState, installedSnapState, smartAccountState } from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isFlaskVersion } from '@/utils'
import { CHAIN_CONFIGS } from '@/constants'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'
import { SnapSigner } from '@/snap-signer'

const CUSTOM_AUTH_APPID = 'f4a86f94041b570ebdd5dc2ff15855d0'

export const useSnap = () => {
	const [isFlask, setHasFlaskDetected] = useRecoilState(flaskState)
	const [installedSnap, setInstalledSnap] = useRecoilState(installedSnapState)
	const [, setSmartAccountState] = useRecoilState(smartAccountState)

	useAsyncEffect(async () => {
		const _isFlask = await isFlaskVersion()
		console.log(`_isFlask: ${_isFlask}`)

		setHasFlaskDetected(_isFlask)
		if (_isFlask) setInstalledSnap(await getSnap())
	}, [])

	const handleConnectSnap = async () => {
		try {
			await connectSnap()
			setInstalledSnap(await getSnap())
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	useAsyncEffect(async () => {
		if (installedSnap) {
			try {
				const address = await getMasterKeyAddress()
				const signer = new SnapSigner(address)
				const smartAccount = new SmartAccount({
					// !Attention: The rpcUrl should be replaced with your RPC node address.
					chainOptions: CHAIN_CONFIGS,
					masterKeySigner: signer,
					// !Attention: The appId should be replaced with the appId assigned to you.
					appId: CUSTOM_AUTH_APPID
				})
				await smartAccount.init({ chainId: CHAIN_CONFIGS[0].chainId })
				const AAaddress = await smartAccount.getAddress()

				setSmartAccountState(utils.getAddress(AAaddress))
			} catch (e: any) {
				upNotify.error(e.message)
			}
		}
	}, [installedSnap])

	return { isFlask, installedSnap, handleConnectSnap }
}
