import { useState } from 'react'
import { Balance } from './balance'
import { ReCharge } from './recharge'
import styles from './topup.module.scss'
import { useMetaMask } from '@/hooks'
import { Dialog, Icon } from '@/components'
import Success from '@/assets/svg/Success.svg'
import NoQRCode from '@/assets/svg/NoQRCode.svg'
import { useRecoilState } from 'recoil'
import { currentSideBarState } from '@/store'
import { useBoolean } from 'ahooks'

const TopUp = () => {
	const [checkedAssets, setCheckAssets] = useState<string | undefined>(undefined)
	const [, setCurrentSideBar] = useRecoilState(currentSideBarState)
	const {
		metamaskAccount,
		connect,
		recharge,
		rechargeLoading,
		isRechargeDialogOpen,
		closeRechargeDialog,
		transactionAmount,
		selectedToken,
		openExplore
	} = useMetaMask()
	const [qrCodeVisible, { setTrue: openQrCodeDialog, setFalse: closeQrCodeDialog }] = useBoolean(false)

	console.log(styles)

	return (
		<div className={styles.topup}>
			<div className={styles.balance}>
				<Balance
					checkedAssets={checkedAssets}
					metamaskAccount={metamaskAccount}
					setCheckAssets={setCheckAssets}
					connect={connect}
					openQrCodeDialog={openQrCodeDialog}
				/>
			</div>
			<div className={styles.recharge}>
				<ReCharge
					metamaskAccount={metamaskAccount}
					checkedAssets={checkedAssets}
					recharge={recharge}
					rechargeLoading={rechargeLoading}
				/>
			</div>
			<Dialog
				title=""
				isOpen={isRechargeDialogOpen}
				onRequestClose={closeRechargeDialog}
				showConfirmButton
				showCancelButton={false}
				confirmText="Go to Payment"
				center={true}
				className={styles.success_dialog}
				onConfirm={() => setCurrentSideBar('Payment')}
				extra={
					<div className={styles.explorer} onClick={openExplore}>
						View in explorer
					</div>
				}
			>
				<Icon src={Success} width={40} height={40} />
				<div className={styles.title}>Top Up Success</div>
				<div className={styles.tips}>
					You have successfully topped up {transactionAmount} {selectedToken?.symbol}. Go experience gas-free
					transactions now
				</div>
			</Dialog>
			<Dialog
				title="Top up"
				isOpen={qrCodeVisible}
				onRequestClose={closeQrCodeDialog}
				showConfirmButton={false}
				showCancelButton={false}
				className={styles.qrcode_dialog}
				center={true}
			>
				<div className={styles.qrcode_wrap}>
					<span className={styles.top_left}></span>
					<span className={styles.top_right}></span>
					<span className={styles.bottom_left}></span>
					<span className={styles.bottom_right}></span>
					<Icon src={NoQRCode} width={120} height={120} />
					<div className={styles.tips}>No QR code</div>
				</div>

				<div className={styles.select}>
					<div className={styles.items}></div>
					<div className={styles.items}></div>
				</div>
			</Dialog>
		</div>
	)
}

export default TopUp
