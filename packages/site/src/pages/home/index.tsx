import { useRecoilValue } from 'recoil'
import { currentSideBarState } from '@/store'
import Payment from '../payment'
import TopUp from '../topup'
import History from '../history'
import styles from './home.module.scss'

const Home: React.FC = () => {
	const currentMenu = useRecoilValue(currentSideBarState)

	const renderHomePage = () => {
		switch (currentMenu) {
			case 'Payment':
				return <Payment />
			case 'TopUp':
				return <TopUp />
			case 'History':
				return <History />
		}
	}

	return <div className={styles.home}>{renderHomePage()}</div>

	// return (
	// 	<div className={styles.home}>
	// 		<div className={styles.summary}>
	// 			<div className={styles.totalBalance}>{smartAccountTotalBalance}</div>
	// 			<div className={styles.actions}>
	// 				<Button size="sm" disabled={!smartAccount} onClick={toggleTopUpVisible}>
	// 					Top Up
	// 				</Button>
	// 				<TopUp topUpVisible={topUpVisible} setFalse={setFalse} setTrue={setTrue} />
	// 			</div>
	// 		</div>
	// 		<Button onClick={handlePay}>Go to Pay</Button>
	// 		{/* <div className={styles.tokens}>
	// 			{tokens.map((token) => {
	// 				return (
	// 					<div key={token.contractAddress}>
	// 						<h3>{getChainNameByChainId(token.chainId)}</h3>
	// 						<p>name: {token.name}</p>
	// 						<p>symbol: {token.symbol}</p>
	// 						<p>balance: {weiToEther(token.balance || 0, token.decimals)}</p>
	// 					</div>
	// 				)
	// 			})}
	// 		</div> */}
	// 	</div>
	// )
}

export default Home
