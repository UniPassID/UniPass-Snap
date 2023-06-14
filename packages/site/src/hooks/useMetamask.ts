import { providers } from 'ethers'
import { useAsyncEffect } from 'ahooks'
import { useRecoilState } from 'recoil'
import { metamaskAccountState } from '@/store'
import { connectSnap, getMasterKeyAddress, getSnap, isFlaskVersion } from '@/utils'
import { ChainConfig } from '@/constants/chains'
import { SmartAccount } from '@unipasswallet/smart-account'
import { upNotify } from '@/components'

export const useSnap = () => {
	const [metamaskAccount, setMetamaskAccountState] = useRecoilState(metamaskAccountState)

	const handleGetEOAContractAddress = async () => {
		try {
			const provider = window.ethereum
			const accounts = await provider.request<string[]>({ method: 'eth_requestAccounts', params: [] })

			console.log(accounts)
			// if (accounts && accounts[0]) setMetamaskAccountState[accounts![0]]
		} catch (e: any) {
			upNotify.error(e.message)
		}
	}

	return {}
}
