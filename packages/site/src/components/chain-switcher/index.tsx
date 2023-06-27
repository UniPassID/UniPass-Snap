import { useRecoilState } from 'recoil'
import clsx from 'clsx'
import styles from './chain-switcher.module.scss'
import { currentChainIdState } from '@/store'
import { ARBITRUM_MAINNET, POLYGON_MAINNET, TESTNET_CHAIN_IDS } from '@/constants'
import { Icon } from '@/components'
import Arbitrum from '@/assets/svg/Arbitrum.svg'
import Polygon from '@/assets/svg/Polygon.svg'

const ChainSwitcher = () => {
	const [currentChainId, setCurrentChainId] = useRecoilState(currentChainIdState)

	const getItemClsx = (chainId: number) => {
		return clsx(styles.item, {
			[styles.selected]: currentChainId === chainId
		})
	}
	if (TESTNET_CHAIN_IDS.includes(currentChainId)) {
		return (
			<div className={styles.testnet}>
				<div className={styles.circle}></div>
				<span>Mumbai</span>
				<span>(Testnet)</span>
			</div>
		)
	} else
		return (
			<div className={styles.wrap}>
				<div className={getItemClsx(ARBITRUM_MAINNET)} onClick={() => setCurrentChainId(ARBITRUM_MAINNET)}>
					<Icon src={Arbitrum} width={20} height={20} />
					<span>Arbitrum</span>
				</div>
				<div className={getItemClsx(POLYGON_MAINNET)} onClick={() => setCurrentChainId(POLYGON_MAINNET)}>
					<Icon src={Polygon} width={20} height={20} />
					<span>Polygon</span>
				</div>
			</div>
		)
}

export default ChainSwitcher
