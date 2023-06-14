import { providers } from 'ethers'
import { useAsyncEffect } from 'ahooks'
import { useRecoilState } from 'recoil'
import { flaskState, installedSnapState, smartAccountState } from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isFlaskVersion } from '@/utils'
import { ChainConfig } from '@/constants/chains'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'

export const useSnap = () => {
	const [isFlask, setHasFlaskDetected] = useRecoilState(flaskState)
	const [installedSnap, setInstalledSnap] = useRecoilState(installedSnapState)
	const [smartAccount, setSmartAccountState] = useRecoilState(smartAccountState)

	useAsyncEffect(async () => {
		const _isFlask = await isFlaskVersion()
		setHasFlaskDetected(_isFlask)
		if (_isFlask) setInstalledSnap(await getSnap())
	}, [isFlask, window.ethereum])

	const handleConnectSnap = async () => {
		try {
			await connectSnap()
			setInstalledSnap(await getSnap())
			upNotify.success('connect success')
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	const handleGetSmartContractAddress = async () => {
		try {
			const address = await getMasterKeyAddress()
			const provider = new providers.JsonRpcProvider(ChainConfig[0].rpcUrl)
			const signer = provider.getSigner(address!)
			const smartAccount = new SmartAccount({
				// !Attention: The rpcUrl should be replaced with your RPC node address.
				chainOptions: ChainConfig,
				masterKeySigner: signer,
				// !Attention: The appId should be replaced with the appId assigned to you.
				appId: 'ce3feaa41d725a018f75b165a8ee528d'
			})
			await smartAccount.init({ chainId: 137 })
			const AAaddress = await smartAccount.getAddress()

			setSmartAccountState(AAaddress)
			upNotify.success('success')
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	return { isFlask, installedSnap, setInstalledSnap, smartAccount, handleConnectSnap, handleGetSmartContractAddress }
}
