import { Dispatch, SetStateAction, useEffect } from 'react'
import MetaMask from '@/assets/svg/MetaMask.svg'
import USDT from '@/assets/svg/USDT.svg'
import USDC from '@/assets/svg/USDC.svg'
import QRCode from '@/assets/svg/QRCode.svg'
import EmptyAssets from '@/assets/svg/EmptyAssets.svg'
import MetaMaskLinear from '@/assets/svg/MetaMask_Linear.svg'
import styles from './topup.module.scss'
import { Button, Icon, Radio } from '@/components'
import {
	ARBITRUM_MAINNET_USDC_ADDRESS,
	ARBITRUM_MAINNET_USDT_ADDRESS,
	POLYGON_MAINNET_USDC_ADDRESS,
	POLYGON_MAINNET_USDT_ADDRESS,
	POLYGON_MUMBAI_USDT_ADDRESS,
	POLYGON_MUMBAI_USDC_ADDRESS
} from '@/constants'
import { isTestnetEnvState, metamaskAccountTokenListState } from '@/store'
import { useRecoilValue } from 'recoil'
import { formatAddress, formatUSDAmount, upGA, weiToEther } from '@/utils'

export const Balance: React.FC<{
	checkedAssets?: string
	metamaskAccount?: string
	setCheckAssets: Dispatch<SetStateAction<string | undefined>>
	connect: () => Promise<void>
	openQrCodeDialog: () => void
}> = ({ checkedAssets, metamaskAccount, setCheckAssets, connect, openQrCodeDialog }) => {
	const isTestnetEnv = useRecoilValue(isTestnetEnvState)
	const tokens = useRecoilValue(metamaskAccountTokenListState)

	useEffect(() => {
		setCheckAssets(undefined)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTestnetEnv])

	const topupViaQRCode = () => {
		openQrCodeDialog()
		upGA('topup-mm-click-via_QRcode', 'topup')
	}

	const getBalance = (contractAddress: string) => {
		const token = tokens.find((token) => contractAddress === token.contractAddress)

		const balance = token ? parseFloat(weiToEther(token.balance || 0, token.decimals)) : 0

		return formatUSDAmount(balance)
	}

	const renderAssets = () => {
		if (!metamaskAccount) {
			return (
				<div className={styles.assets}>
					<div className={styles.title}>ASSETS</div>
					<div className={styles.empty}>
						<Icon src={EmptyAssets} width={120} height={120} />
						<span className={styles.tips}>Display assets after getting the address</span>
						<Button btnType="filled" style={{ width: '100%' }} onClick={connect}>
							Get MetaMask address
						</Button>
					</div>
				</div>
			)
		}

		return isTestnetEnv ? (
			<div className={styles.assets}>
				<div className={styles.title}>ASSETS</div>
				<div className={styles.items}>
					<div className={styles.Polygon}>
						<span>On Mumbai</span>
						<div className={styles.divider} />
					</div>
					<div className={styles.usd} onClick={() => setCheckAssets(POLYGON_MUMBAI_USDT_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDT} width={40} height={40} />
							<span className={styles.symbol}>USDT</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(POLYGON_MUMBAI_USDT_ADDRESS)}</div>
							<Radio value={POLYGON_MUMBAI_USDT_ADDRESS} checked={checkedAssets === POLYGON_MUMBAI_USDT_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
					<div className={styles.divider}></div>
					<div className={styles.usd} onClick={() => setCheckAssets(POLYGON_MUMBAI_USDC_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDC} width={40} height={40} />
							<span className={styles.symbol}>USDC</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(POLYGON_MUMBAI_USDC_ADDRESS)}</div>
							<Radio value={POLYGON_MUMBAI_USDC_ADDRESS} checked={checkedAssets === POLYGON_MUMBAI_USDC_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
				</div>
			</div>
		) : (
			<div className={styles.assets}>
				<div className={styles.title}>ASSETS</div>
				<div className={styles.items}>
					<div className={styles.Arbitrum}>
						<span>On Arbitrum</span>
						<div className={styles.divider} />
					</div>
					<div className={styles.usd} onClick={() => setCheckAssets(ARBITRUM_MAINNET_USDT_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDT} width={40} height={40} />
							<span className={styles.symbol}>USDT</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(ARBITRUM_MAINNET_USDT_ADDRESS)}</div>
							<Radio value={ARBITRUM_MAINNET_USDT_ADDRESS} checked={checkedAssets === ARBITRUM_MAINNET_USDT_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
					<div className={styles.divider}></div>
					<div className={styles.usd} onClick={() => setCheckAssets(ARBITRUM_MAINNET_USDC_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDC} width={40} height={40} />
							<span className={styles.symbol}>USDC</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(ARBITRUM_MAINNET_USDC_ADDRESS)}</div>
							<Radio value={ARBITRUM_MAINNET_USDC_ADDRESS} checked={checkedAssets === ARBITRUM_MAINNET_USDC_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
				</div>
				<div className={styles.items}>
					<div className={styles.Polygon}>
						<span>On Polygon</span>
						<div className={styles.divider} />
					</div>
					<div className={styles.usd} onClick={() => setCheckAssets(POLYGON_MAINNET_USDT_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDT} width={40} height={40} />
							<span className={styles.symbol}>USDT</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(POLYGON_MAINNET_USDT_ADDRESS)}</div>
							<Radio value={POLYGON_MAINNET_USDT_ADDRESS} checked={checkedAssets === POLYGON_MAINNET_USDT_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
					<div className={styles.divider}></div>
					<div className={styles.usd} onClick={() => setCheckAssets(POLYGON_MAINNET_USDC_ADDRESS)}>
						<div className={styles.coin}>
							<Icon src={USDC} width={40} height={40} />
							<span className={styles.symbol}>USDC</span>
						</div>
						<div className={styles.value}>
							<div className={styles.num}>{getBalance(POLYGON_MAINNET_USDC_ADDRESS)}</div>
							<Radio value={POLYGON_MAINNET_USDC_ADDRESS} checked={checkedAssets === POLYGON_MAINNET_USDC_ADDRESS}>
								{''}
							</Radio>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
			<div>
				<div className={styles.metamask}>
					<Icon src={MetaMask} width={60} height={60} />
					{metamaskAccount && (
						<div className={styles.metamask_account}>
							<Icon src={MetaMaskLinear} width={20} height={20} />
							{metamaskAccount && formatAddress(metamaskAccount)}
						</div>
					)}
				</div>
				<p className={styles.tips}>Please connect your MetaMask address first</p>
				{renderAssets()}
			</div>
			<div className={styles.qrcode_btn}>
				<Button size="md" btnType="gray" icon={<Icon src={QRCode} size="lg" />} onClick={topupViaQRCode}>
					Top up via QRcode
				</Button>
			</div>
		</>
	)
}
