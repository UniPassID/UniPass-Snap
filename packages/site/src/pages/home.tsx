import { Button } from '@/components'
import { useSnap } from '@/hooks'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
	const { isFlask, handleConnectSnap } = useSnap()
	const navigate = useNavigate()

	const installFlask = () => {
		window.open('https://metamask.io/flask/', '_blank')
	}

	const handlePay = () => {
		navigate('/pay?chainId=80001&symbol=USDC')
	}

	return (
		<div>
			{!isFlask && <Button onClick={installFlask}>Install Flask</Button>}
			<br />
			{<Button onClick={handleConnectSnap}>Connect</Button>}
			{<Button onClick={handlePay}>Go to Pay</Button>}
			{/* <Button onClick={initSmartContract} disabled={!installedSnap}> */}
			Get Smart Contract Address
			{/* </Button> */}
			{/* <Button onClick={handleGetEOAContractAddress} disabled={!installedSnap}>
				Get EOA(Snap) Address
			</Button> */}
		</div>
	)
}

export default Home
