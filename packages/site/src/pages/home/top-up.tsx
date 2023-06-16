import React from 'react'
import { useBoolean, useCounter } from 'ahooks'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { QRCodeSVG } from 'qrcode.react'
import { useRecoilValue } from 'recoil'
import { Button, Dialog, upNotify } from '@/components'
import { smartAccountState } from '@/store'
import { useMetaMask } from '@/hooks'
import { getChainNameByChainId } from '@/constants'
import { weiToEther } from '@/utils'
import styles from './home.module.scss'

interface TopUpProps {
	topUpVisible: boolean
	setFalse: () => void
	setTrue: () => void
}

const TopUp: React.FC<TopUpProps> = ({ topUpVisible, setFalse }) => {
	const smartAccount = useRecoilValue(smartAccountState)
	const [current, { inc }] = useCounter(1)
	const { tokens, metamaskAccount, connect, recharge } = useMetaMask()
	const [showQRcode, { setTrue: setShowQRCode, setFalse: setCloseQRCode }] = useBoolean(false)

	const renderDialog = () => {
		if (showQRcode) {
			return (
				<>
					<QRCodeSVG value={smartAccount} />
					<CopyToClipboard
						text={smartAccount}
						onCopy={() => {
							upNotify.success('copied')
						}}
					>
						<span>Copy to clipboard with span</span>
					</CopyToClipboard>
				</>
			)
		}

		if (metamaskAccount) {
			return (
				<>
					<span>MetaMask Address: {metamaskAccount}</span>
					<div style={{ overflow: 'scroll', height: '200px' }}>
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
					<Button onClick={recharge}>recharge</Button>
					<span onClick={setShowQRCode}>TopUp via QRCode</span>
				</>
			)
		} else {
			return (
				<>
					<span>Snap 需要读取你的 MetaMask 地址来完成便捷的资产充值</span>
					<Button size="sm" disabled={!smartAccount} onClick={connect}>
						Get MetaMask Address
					</Button>
					<span>Top up via QRcode</span>
				</>
			)
		}
	}

	return (
		<Dialog
			title=""
			onAfterClose={() => {
				inc()
				setCloseQRCode()
			}}
			isOpen={topUpVisible}
			onRequestClose={setFalse}
			onCancel={setFalse}
			showCancelButton={false}
			showConfirmButton={false}
			style={{ content: { width: '500px', height: '400px' } }}
		>
			<div className={styles.top_up} key={current}>
				{renderDialog()}
			</div>
		</Dialog>
	)
}

export default TopUp
