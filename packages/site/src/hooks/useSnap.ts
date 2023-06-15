import { useAsyncEffect } from 'ahooks'
import { useRecoilState } from 'recoil'
import { flaskState, installedSnapState, smartAccountState } from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isFlaskVersion } from '@/utils'
import { ChainConfig } from '@/constants/chains'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'
import { SnapSigner } from '@/snap-signer'

const CUSTOM_AUTH_APPID = 'f4a86f94041b570ebdd5dc2ff15855d0'
const DEFAULT_CHAIN = 137

export const useSnap = () => {
	const [isFlask, setHasFlaskDetected] = useRecoilState(flaskState)
	const [installedSnap, setInstalledSnap] = useRecoilState(installedSnapState)
	const [smartAccount, setSmartAccountState] = useRecoilState(smartAccountState)

	useAsyncEffect(async () => {
		const _isFlask = await isFlaskVersion()
		setHasFlaskDetected(_isFlask)
		if (_isFlask) setInstalledSnap(await getSnap())
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
				const address = await getMasterKeyAddress()
				const signer = new SnapSigner(address)
				const smartAccount = new SmartAccount({
					chainOptions: ChainConfig,
					masterKeySigner: signer,
					appId: CUSTOM_AUTH_APPID
				})
				await smartAccount.init({ chainId: DEFAULT_CHAIN })
				const AAaddress = await smartAccount.getAddress()	
				setSmartAccountState(AAaddress)
				upNotify.success('success')
			} catch (e: any) {
				upNotify.error(e.message)
			}
		}
	}, [installedSnap])

	return { isFlask, installedSnap, setInstalledSnap, smartAccount, handleConnectSnap }
}
