import { Button } from '@/components'
import { useSnap, useMetamask } from '@/hooks'

const EOABalancePage: React.FC = () => {
	const { installedSnap } = useSnap()
	const { tokens, handleGetEOAAddress } = useMetamask()
	console.log(tokens)

	return (
		<div>
			<Button onClick={handleGetEOAAddress} disabled={!installedSnap}>
				Get EOA(Snap) Address
			</Button>
			<ul>
				{tokens.map((token) => {
					return (
						<li key={token.contractAddress}>
							<p>decimals: {token.decimals}</p>
							<p>name: {token.name}</p>
							<p>symbol: {token.symbol}</p>
							<p>contractAddress: {token.contractAddress}</p>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default EOABalancePage
