import { useContext } from 'react'
import { MetaMaskContext, MetamaskActions } from '@/hooks/metamask-context'
import { Button } from '@/components'
import { connectSnap, getMasterKeyAddress, getSnap } from '@/utils'
import { providers, Wallet, utils } from 'ethers'
import { ChainConfig } from '@/constants/chains'
import { SmartAccount } from '@unipasswallet/smart-account'
import { LocalStorage } from '@unipasswallet/smart-account-signer'

const Home: React.FC = () => {
	const [state, dispatch] = useContext(MetaMaskContext)

	const installFlask = () => {
		window.open('https://metamask.io/flask/', '_blank')
	}

	const handleConnect = async () => {
		try {
			await connectSnap()
			const installedSnap = await getSnap()

			dispatch({
				type: MetamaskActions.SetInstalled,
				payload: installedSnap
			})
		} catch (e) {
			console.error(e)
			dispatch({ type: MetamaskActions.SetError, payload: e })
		}
	}

	const handleGetAddress = async () => {
		try {
			const privateKey = await getMasterKeyAddress()
			const provider = new providers.JsonRpcProvider(ChainConfig[0].rpcUrl)
			const wallet = new Wallet(privateKey!)
			const signer = provider.getSigner(wallet.address)
			const smartAccount = new SmartAccount({
				// !Attention: The rpcUrl should be replaced with your RPC node address.
				chainOptions: ChainConfig,
				masterKeySigner: signer,
				// !Attention: The appId should be replaced with the appId assigned to you.
				appId: 'ce3feaa41d725a018f75b165a8ee528d'
			})
			await smartAccount.init({ chainId: 137 })
		} catch (e) {
			console.error(e)
			dispatch({ type: MetamaskActions.SetError, payload: e })
		}
	}

	return (
		<div>
			{!state.isFlask && <Button onClick={installFlask}>Install Flask</Button>}
			<br />
			<Button onClick={handleConnect}>Connect</Button>
			<Button onClick={handleGetAddress}>Get Address</Button>
		</div>
	)
}

export default Home
