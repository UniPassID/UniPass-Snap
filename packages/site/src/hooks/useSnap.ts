import { utils } from 'ethers'
import { useAsyncEffect, useBoolean } from 'ahooks'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
	metaMaskState,
	installedSnapState,
	smartAccountState,
	smartAccountInsState,
	currentChainIdState
} from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isMetaMaskVersion, upGA } from '@/utils'
import { CHAIN_CONFIGS, CUSTOM_AUTH_APPID } from '@/constants'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'
import { SnapSigner } from '@/snap-signer'
import { fetchAccessToken } from '@/utils/account'

export const useSnap = () => {
	const [isMetaMask, setHasMetaMaskDetected] = useRecoilState(metaMaskState)
	const [installedSnap, setInstalledSnap] = useRecoilState(installedSnapState)
	const currentChainId = useRecoilValue(currentChainIdState)
	const setSmartAccountState = useSetRecoilState(smartAccountState)
	const setSmartAccountInsState = useSetRecoilState(smartAccountInsState)
	const [connectSnapLoading, { setTrue: startConnectSnap, setFalse: endConnectSnap }] = useBoolean(false)
	const [loadSnapLoading, { setTrue: startLoadSnap, setFalse: endLoadSnap }] = useBoolean(false)

	useAsyncEffect(async () => {
		startLoadSnap()
		try {
			let Status = ''
			const _isMetaMask = await isMetaMaskVersion()

			setHasMetaMaskDetected(_isMetaMask)
			if (_isMetaMask) {
				Status = 'MM_installed_no_Snap'
				const localSmartAccountAddress = window.localStorage.getItem('up__smartAccountAddress')
				if (localSmartAccountAddress && utils.isAddress(localSmartAccountAddress)) {
					setSmartAccountState(localSmartAccountAddress)
					const snap = await getSnap()
					if (snap) Status = 'MM_installed_Snap_installed'
					setInstalledSnap(snap)
					await getSmartAccount()
				}
			} else {
				Status = 'no_MM_no_Snap'
			}
			upGA('open-snap', 'homepage', { MetamaskStatus: Status })
		} finally {
			endLoadSnap()
		}
	}, [])

	const handleConnectSnap = async () => {
		try {
			startConnectSnap()
			await connectSnap()
			setInstalledSnap(await getSnap())
			const res = await getSmartAccount()
			if (res?.isNewAccount) {
				upGA('pre_signup-success', 'signup', { SnapAddress: `_${res?.smartAccountAddress}` })
			} else {
				upGA('login-success', 'login', { SnapAddress: `_${res?.smartAccountAddress}` })
			}
		} catch (e: any) {
			upNotify.error(e.message)
		} finally {
			endConnectSnap()
		}
	}

	const getSmartAccount = async () => {
		const masterKeyAddress = await getMasterKeyAddress()
		const signer = new SnapSigner(masterKeyAddress)
		const smartAccount = new SmartAccount({
			chainOptions: CHAIN_CONFIGS,
			masterKeySigner: signer,
			appId: CUSTOM_AUTH_APPID,
			unipassServerUrl: process.env.REACT_APP_SDK_URL_PREFIX
		})
		await smartAccount.init({ chainId: currentChainId })
		setSmartAccountInsState(smartAccount)
		const address = await smartAccount.getAddress()
		const smartAccountAddress = utils.getAddress(address)
		window.localStorage.setItem('up__smartAccountAddress', smartAccountAddress)
		setSmartAccountState(smartAccountAddress)
		const res = await fetchAccessToken({
			accountAddress: smartAccountAddress,
			providerIdentifier: masterKeyAddress
		})

		return { smartAccountAddress, isNewAccount: res.isNewAccount }
	}

	return { isMetaMask, installedSnap, handleConnectSnap, connectSnapLoading, loadSnapLoading }
}
