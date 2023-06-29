import { useRecoilState, useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './chain-switcher.module.scss'
import { currentChainIdState, editingPaymentState, smartAccountInsState } from '@/store'
import { ARBITRUM_MAINNET, POLYGON_MAINNET, TESTNET_CHAIN_IDS } from '@/constants'
import { Dialog, Icon } from '@/components'
import Arbitrum from '@/assets/svg/Arbitrum.svg'
import Polygon from '@/assets/svg/Polygon.svg'
import { useBoolean } from 'ahooks'
import { useState } from 'react'

const ChainSwitcher = () => {
	const [currentChainId, setCurrentChainId] = useRecoilState(currentChainIdState)
	const smartAccountIns = useRecoilValue(smartAccountInsState)
	const editingPayment = useRecoilValue(editingPaymentState)
	const [switchChainConfirm, { setFalse, setTrue }] = useBoolean(false)
	const [selectChainId, setSelectChainId] = useState<number>()

	const beforeSwitchChain = (chainId: number) => {
		console.log(editingPayment)
		setSelectChainId(chainId)
		if (editingPayment) {
			setTrue()
			return
		} else {
			setCurrentChainId(chainId)
			smartAccountIns?.switchChain?.(chainId)
		}
	}

	const switchChain = () => {
		if (!selectChainId) return
		setCurrentChainId(selectChainId)
		smartAccountIns?.switchChain?.(selectChainId)
		setFalse()
	}

	const getItemClsx = (chainId: number) => {
		return clsx(styles.item, {
			[styles.selected]: currentChainId === chainId
		})
	}

	const render = () => {
		if (TESTNET_CHAIN_IDS.includes(currentChainId)) {
			return (
				<div className={styles.testnet}>
					<div className={styles.circle}></div>
					<span>Mumbai</span>
					<span>&nbsp;(Testnet)</span>
				</div>
			)
		} else
			return (
				<div className={styles.wrap}>
					<div className={getItemClsx(ARBITRUM_MAINNET)} onClick={() => beforeSwitchChain(ARBITRUM_MAINNET)}>
						<Icon src={Arbitrum} width={20} height={20} />
						<span>Arbitrum</span>
					</div>
					<div className={getItemClsx(POLYGON_MAINNET)} onClick={() => beforeSwitchChain(POLYGON_MAINNET)}>
						<Icon src={Polygon} width={20} height={20} />
						<span>Polygon</span>
					</div>
				</div>
			)
	}

	return (
		<>
			{render()}
			<Dialog
				title="Confirmation"
				isOpen={switchChainConfirm}
				onCancel={() => {
					setFalse()
					setSelectChainId(undefined)
				}}
				center
				onConfirm={switchChain}
				onRequestClose={() => {
					setFalse()
					setSelectChainId(undefined)
				}}
			>
				Switching networks will clear your current payment information. Are you sure you want to switch?
			</Dialog>
		</>
	)
}

export default ChainSwitcher
