import React from 'react'
import { Button, Dialog } from '@/components'
import styles from './home.module.scss'
import { useRecoilValue } from 'recoil'
import { smartAccountState } from '@/store'
import { useMetamask } from '@/hooks'

interface TopUpProps {
	topUpVisible: boolean
	setFalse: () => void
	setTrue: () => void
}

const TopUp: React.FC<TopUpProps> = ({ topUpVisible, setFalse, setTrue }) => {
	const smartAccount = useRecoilValue(smartAccountState)
	const { metamaskAccount, handleGetEOAAddress } = useMetamask()

	const renderDialog = () => {
		if (metamaskAccount) {
			return (
				<div className={styles.top_up}>
					<span>MetaMask Address: {metamaskAccount}</span>
				</div>
			)
		} else {
			return (
				<div className={styles.top_up}>
					<span>Snap 需要读取你的 MetaMask 地址来完成便捷的资产充值</span>
					<Button size="sm" disabled={!smartAccount} onClick={handleGetEOAAddress}>
						Get MetaMask Address
					</Button>
					<span>Top up via QRcode</span>
				</div>
			)
		}
	}

	return (
		<Dialog
			title=""
			isOpen={topUpVisible}
			onRequestClose={setFalse}
			onCancel={setFalse}
			showCancelButton={false}
			showConfirmButton={false}
			style={{ content: { width: '500px', height: '400px' } }}
		>
			{renderDialog()}
		</Dialog>
	)
}

export default TopUp
