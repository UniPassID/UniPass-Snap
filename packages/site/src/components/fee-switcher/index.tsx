import clsx from 'clsx'
import styles from './fee-switcher.module.scss'
import { Icon } from '@/components'
import USDC from '@/assets/svg/USDC.svg'
import USDT from '@/assets/svg/USDT.svg'
import { useState } from 'react'

const FeeSwitcher: React.FC<{
	onSwitchToken: (symbol: string) => void
}> = ({ onSwitchToken }) => {

	const [symbol, setSymbol] = useState<string>('USDT')

	const getItemClsx = (currentSymbol: string) => {
		return clsx(styles.item, {
			[styles.selected]: currentSymbol === symbol
		})
	}
	const switchToken = (symbol: string) => {
		setSymbol(symbol)
		onSwitchToken(symbol)
	}
	return (
		<div className={styles.wrap}>
			<div className={getItemClsx('USDT')} onClick={() => switchToken('USDT')}>
				<Icon src={USDT} width={20} height={20} />
				<span>USDT</span>
			</div>
			<div className={getItemClsx('USDC')} onClick={() => switchToken('USDC')}>
				<Icon src={USDC} width={20} height={20} />
				<span>USDC</span>
			</div>
		</div>
	)
}

export default FeeSwitcher
