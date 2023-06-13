import { useContext } from 'react'
import { MetaMaskContext, MetamaskActions } from '@/hooks/metamask-context'
import { Button } from '@/components'
import { connectSnap, getSnap } from '@/utils'

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

	return (
		<div>
			{!state.isFlask && <Button onClick={installFlask}>Install Flask</Button>}
			<br />
			{!state.installedSnap && <Button onClick={handleConnect}>Connect</Button>}
		</div>
	)
}

export default Home
