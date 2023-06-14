import { Button, upNotify } from '@/components'
import { useSnap } from '@/hooks'

const Home: React.FC = () => {
	const { isFlask, installedSnap, smartAccount, handleConnectSnap, handleGetSmartContractAddress } = useSnap()

	const installFlask = () => {
		window.open('https://metamask.io/flask/', '_blank')
	}

	return (
		<div>
			{!isFlask && <Button onClick={installFlask}>Install Flask</Button>}
			<br />
			{smartAccount && <h2>Smart Contract Address: {smartAccount}</h2>}
			{<Button onClick={handleConnectSnap}>Connect</Button>}
			<Button onClick={handleGetSmartContractAddress} disabled={!installedSnap}>
				Get Smart Contract Address
			</Button>
			{/* <Button onClick={handleGetEOAContractAddress} disabled={!installedSnap}>
				Get EOA(Snap) Address
			</Button> */}
		</div>
	)
}

export default Home
