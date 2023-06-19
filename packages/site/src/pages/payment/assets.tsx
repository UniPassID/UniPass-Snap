import { useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import numbor from 'numbro'
import ChainSwitcher from '@/components/chain-switcher'
import { currentChainIdState, currentSideBarState, smartAccountState, smartAccountTokenListState } from '@/store'
import styles from './payment.module.scss'
import { formatAddress, weiToEther } from '@/utils'
import { Button, Icon } from '@/components'
import USDT from '@/assets/svg/USDT.svg'
import USDC from '@/assets/svg/USDC.svg'
import TopUpButton from '@/assets/svg/TopUpButton.svg'
import ExploreButton from '@/assets/svg/ExploreButton.svg'
import { CHAIN_CONFIGS } from '@/constants'

const Assets = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const currentChainId = useRecoilValue(currentChainIdState)
	const tokens = useRecoilValue(smartAccountTokenListState)
	const [, setCurrentSideBar] = useRecoilState(currentSideBarState)

	const totalBalanceOnChain = useMemo(() => {
		let erc20Balance = 0

		tokens.forEach((token) => {
			if (currentChainId === token.chainId) {
				erc20Balance = erc20Balance + parseFloat(weiToEther(token.balance || 0, token.decimals))
			}
		})

		return erc20Balance
	}, [tokens, currentChainId])

	const USDTBalance = useMemo(() => {
		const token = tokens.find((token) => currentChainId === token.chainId && token.symbol === 'USDT')

		return token ? parseFloat(weiToEther(token.balance || 0, token.decimals)) : 0
	}, [tokens, currentChainId])

	const USDCBalance = useMemo(() => {
		const token = tokens.find((token) => currentChainId === token.chainId && token.symbol === 'USDC')

		return token ? parseFloat(weiToEther(token.balance || 0, token.decimals)) : 0
	}, [tokens, currentChainId])

	const openExplore = () => {
		const token = CHAIN_CONFIGS.find((chain) => currentChainId === chain.chainId)

		if (token) {
			window.open(`${token.explorer}/address/${smartAccount}`, '_blank')
		}
	}

	return (
		<>
			<div className={styles.assets}>
				<ChainSwitcher />
				<div className={styles.title}>STABLE COIN BALANCE</div>
				<div className={styles.value}>
					<span>$</span>
					<span>{numbor(totalBalanceOnChain).format({ thousandSeparated: true, mantissa: 2 })}</span>
				</div>
				<Button
					size="md"
					btnType="gray"
					icon={<Icon src={TopUpButton} size="lg" />}
					onClick={() => setCurrentSideBar('TopUp')}
				>
					Top Up
				</Button>
				<div className={styles.title}>ASSETS</div>
				<div className={styles.coins}>
					<div className={styles.USD}>
						<div className={styles.info}>
							<Icon src={USDT} width={40} height={40} />
							<div className={styles.text_info}>
								<span className={styles.symbol}>USDT</span>
								<span className={styles.name}>Tether</span>
							</div>
						</div>
						<div className={styles.balance}>{numbor(USDTBalance).format({ thousandSeparated: true, mantissa: 2 })}</div>
					</div>
					<div className={styles.USD}>
						<div className={styles.info}>
							<Icon src={USDC} width={40} height={40} />
							<div className={styles.text_info}>
								<span className={styles.symbol}>USDC</span>
								<span className={styles.name}>USD Coin</span>
							</div>
						</div>
						<div className={styles.balance}>{numbor(USDCBalance).format({ thousandSeparated: true, mantissa: 2 })}</div>
					</div>
				</div>
			</div>

			<div className={styles.smart_account}>
				<div className={styles.address}>
					<span className={styles.circle}></span>
					{formatAddress(smartAccount)}
				</div>
				<div className={styles.explore} onClick={openExplore}>
					<Icon src={ExploreButton} width={16} height={16} />
				</div>
			</div>
		</>
	)
}

export default Assets
