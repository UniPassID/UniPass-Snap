import { Button } from '@/components'
import { useAccount } from '@/hooks'
import styles from './home.module.scss'
import { useBoolean } from 'ahooks'
import TopUp from './top-up'
import { weiToEther } from '@/utils'
import { getChainNameByChainId } from '@/constants'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
	const navigate = useNavigate()
	const { smartAccount, smartAccountTotalBalance, tokens } = useAccount()
	const [topUpVisible, { toggle: toggleTopUpVisible, setFalse, setTrue }] = useBoolean(false)

	const handlePay = () => {
		navigate('/pay?chainId=80001&symbol=USDC')
	}

	return (
		<div className={styles.home}>
			<div className={styles.summary}>
				<div className={styles.totalBalance}>{smartAccountTotalBalance}</div>
				<div className={styles.actions}>
					<Button size="sm" disabled={!smartAccount} onClick={toggleTopUpVisible}>
						Top Up
					</Button>
					<TopUp topUpVisible={topUpVisible} setFalse={setFalse} setTrue={setTrue} />
				</div>
			</div>
			<Button onClick={handlePay}>Go to Pay</Button>
			<div className={styles.tokens}>
				{tokens.map((token) => {
					return (
						<div key={token.contractAddress}>
							<h3>{getChainNameByChainId(token.chainId)}</h3>
							<p>name: {token.name}</p>
							<p>symbol: {token.symbol}</p>
							<p>balance: {weiToEther(token.balance || 0, token.decimals)}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Home
