import { useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Balance } from './balance'
import { ReCharge } from './recharge'
import styles from './topup.module.scss'
import { useMetaMask } from '@/hooks'
import { Dialog, Icon, TokenIcon, upNotify } from '@/components'
import Success from '@/assets/svg/Success.svg'
import NoQRCode from '@/assets/svg/NoQRCode.svg'
import Copy from '@/assets/svg/Copy.svg'
import { currentSideBarState, smartAccountState } from '@/store'
import { useBoolean } from 'ahooks'
import Select from 'rc-select'
import { CHAIN_CONFIGS, getChainNameByChainId } from '@/constants'
import { QRCodeSVG } from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const TopUp = () => {
	const smartAccount = useRecoilValue(smartAccountState)
	const [checkedAssets, setCheckAssets] = useState<string | undefined>(undefined)
	const setCurrentSideBar = useSetRecoilState(currentSideBarState)
	const {
		metamaskAccount,
		connect,
		recharge,
		rechargeLoading,
		isRechargeDialogOpen,
		closeRechargeDialog,
		transactionAmount,
		selectedToken,
		viewInExplore
	} = useMetaMask()
	const [qrCodeVisible, { setTrue: openQrCodeDialog, setFalse: closeQrCodeDialog }] = useBoolean(false)

	const [netWork, setNetwork] = useState()
	const [token, setToken] = useState()

	const showQRCode = useMemo(() => {
		return netWork && token
	}, [netWork, token])

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
					<div className={styles.explorer} onClick={viewInExplore}>
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
					{showQRCode ? (
						<QRCodeSVG value={smartAccount} size={180} />
					) : (
						<>
							<Icon src={NoQRCode} width={120} height={120} />
							<div className={styles.tips}>No QR code</div>
						</>
					)}
				</div>

				{showQRCode ? (
					<div className={styles.address}>
						{smartAccount}
						<CopyToClipboard text={smartAccount} onCopy={() => upNotify.success('Copy Success')}>
							<span>
								<Icon src={Copy} width={20} height={20} />
							</span>
						</CopyToClipboard>
					</div>
				) : (
					<div className={styles.notice}>Please select the token and chain first</div>
				)}

				<div className={styles.select}>
					<div className={styles.items}>
						<div className={styles.title}>NETWORK</div>
						<Select placeholder="Choose Network" style={{ width: '190px' }} onChange={setNetwork}>
							{CHAIN_CONFIGS.map((token) => (
								<Select.Option key={token.chainId} value={token.chainId}>
									<TokenIcon
										type={getChainNameByChainId(token.chainId)}
										style={{ marginRight: '12px' }}
										width={20}
										height={20}
									/>
									{getChainNameByChainId(token.chainId)}
								</Select.Option>
							))}
						</Select>
					</div>
					<div className={styles.items}>
						<div className={styles.title}>TOKEN</div>
						<Select placeholder="Choose Token" style={{ width: '190px' }} onChange={setToken}>
							<Select.Option key="USDT" value="USDT">
								<TokenIcon type="USDT" style={{ marginRight: '12px' }} width={20} height={20} />
								USDT
							</Select.Option>
							<Select.Option key="USDC" value="USDC">
								<TokenIcon type="USDC" style={{ marginRight: '12px' }} width={20} height={20} />
								USDC
							</Select.Option>
						</Select>
					</div>
				</div>
				{showQRCode ? (
					<div className={styles.warning}>
						Only supports top up with USDT or USDC. Topping up with other tokens may result in a loss of funds
					</div>
				) : null}
			</Dialog>
		</div>
	)
}

export default TopUp
