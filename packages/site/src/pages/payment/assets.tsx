import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import ChainSwitcher from '@/components/chain-switcher'
import { currentChainIdState, smartAccountTokenListState } from '@/store'
import styles from './payment.module.scss'
import { weiToEther } from '@/utils'

const Assets = () => {
	const currentChainId = useRecoilValue(currentChainIdState)
	const tokens = useRecoilValue(smartAccountTokenListState)

	const totalBalanceOnChain = useMemo(() => {
		let erc20Balance = 0
		console.log(currentChainId)
		console.log(tokens)

		tokens.forEach((token) => {
			if (currentChainId === token.chainId) {
				erc20Balance = erc20Balance + parseFloat(weiToEther(token.balance || 0, token.decimals))
			}
		})

		return erc20Balance
	}, [tokens, currentChainId])

	return (
		<>
			<ChainSwitcher />
			<div className={styles.balance}>
				<div className={styles.title}>STABLE COIN BALANCE</div>
				<div className={styles.value}>
					<span>$</span>
					<span>{totalBalanceOnChain}</span>
				</div>
			</div>
		</>
	)
}

export default Assets
