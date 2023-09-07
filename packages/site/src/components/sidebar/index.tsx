import { useBoolean } from 'ahooks'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import clsx from 'clsx'
import { MenuType } from '@/types'
import { Icon, Popover } from '@/components'
import {
	currentSideBarState,
	// isTestnetEnvState,
	// currentChainIdState,
	smartAccountState,
	pendingTransactionState
	// smartAccountInsState
} from '@/store'
import Logo from '@/assets/svg/unipass.svg'
import Payment from '@/assets/svg/Payment.svg'
import PaymentSelected from '@/assets/svg/PaymentSelected.svg'
import TopUp from '@/assets/svg/TopUp.svg'
import TopUpSelected from '@/assets/svg/TopUpSelected.svg'
import History from '@/assets/svg/History.svg'
import HistorySelected from '@/assets/svg/HistorySelected.svg'
import More from '@/assets/svg/More.svg'
// import Testnet from '@/assets/svg/Testnet.svg'
import Support from '@/assets/svg/Support.svg'
import Disconnect from '@/assets/svg/Disconnect.svg'
import Close from '@/assets/svg/Close.svg'
import Document from '@/assets/svg/Document.svg'
import FAQ from '@/assets/svg/FAQ.svg'
// import { ARBITRUM_MAINNET, POLYGON_MUMBAI } from '@/constants'
import styles from './sidebar.module.scss'
import { upGA } from '@/utils'

const menus: Array<{ name: MenuType }> = [
	{
		name: 'Payment'
	},
	{
		name: 'TopUp'
	},
	{
		name: 'History'
	}
]

const SideBar = () => {
	const [showActions, { toggle }] = useBoolean(false)
	// const setCurrentChainIdState = useSetRecoilState(currentChainIdState)
	const [currentSideBar, setCurrentSideBar] = useRecoilState(currentSideBarState)
	// const isTestnetEnv = useRecoilValue(isTestnetEnvState)
	const setSmartAccountState = useSetRecoilState(smartAccountState)
	const pendingTransaction = useRecoilValue(pendingTransactionState)
	// const smartAccountIns = useRecoilValue(smartAccountInsState)

	const getMenuClassName = (name: MenuType) => {
		return clsx(styles.menu, {
			[styles.selected]: currentSideBar === name
		})
	}

	const getMenuIcon = (name: MenuType) => {
		const selected = name === currentSideBar

		switch (name) {
			case 'Payment':
				return <Icon src={selected ? PaymentSelected : Payment} width={20} height={20} />
			case 'TopUp':
				return <Icon src={selected ? TopUpSelected : TopUp} width={20} height={20} />
			case 'History':
				return <Icon src={selected ? HistorySelected : History} width={20} height={20} />
		}
	}

	const switchSideBarState = (menu: MenuType) => {
		if (menu === currentSideBar) return
		setCurrentSideBar(menu)
		if (menu === 'TopUp') {
			upGA('topup-click-topup_menu', 'topup')
		}
		if (menu === 'Payment') {
			upGA('payment-click-payment_menu', 'payment')
		}
	}

	// const handleSwitchEnv = () => {
	// 	const checked = !isTestnetEnv
	// 	const chainId = checked ? POLYGON_MUMBAI : ARBITRUM_MAINNET
	// 	window.localStorage.setItem('up__currentChainId', chainId.toString())
	// 	setCurrentChainIdState(chainId)
	// 	smartAccountIns.switchChain(chainId)
	// 	upGA('setting-switch-testnet', 'setting', { Environment: checked ? 'Testnet' : 'Mainnet' })
	// }

	const disconnect = () => {
		window.localStorage.removeItem('up__smartAccountAddress')
		window.sessionStorage.removeItem('up__accessToken')
		setSmartAccountState('')
		toggle()
		upGA('setting-click-disconnect', 'setting')
	}

	const handleOpenDocument = () => {
		var url = 'https://accountlabs.notion.site/UniPass-Document-90ee049fb60b4601a2e3b43e3c5a7e1d'
		window.open(url, '_blank')
		upGA('setting-click-document', 'setting')
	}

	const handleOpenFAQ = () => {
		var url = 'https://accountlabs.notion.site/UniPass-FAQ-f14aee595f694f71812588309e62c5be'
		window.open(url, '_blank')
		upGA('setting-click-FAQ', 'setting')
	}

	const handleSupport = () => {
		var url = 'https://t.me/+Hr3N_I3xJmtlMDQ1'
		window.open(url, '_blank')
		upGA('setting-click-support', 'setting')
	}

	return (
		<div className={styles.sidebar}>
			<div className={styles.menus}>
				<div className={styles.logo}>
					<Icon src={Logo} height={24} width={115} />
				</div>
				<div className={styles.menus}>
					{menus.map((menu) => {
						return (
							<div
								key={menu.name}
								className={getMenuClassName(menu.name)}
								onClick={() => switchSideBarState(menu.name)}
							>
								<div className={styles.menu_inner}>
									{getMenuIcon(menu.name)}
									{menu.name}
									{menu.name === 'History' && pendingTransaction > 0 && (
										<div className={styles.pop}>{pendingTransaction}</div>
									)}
								</div>
								<div className={styles.side_divider}></div>
							</div>
						)
					})}
				</div>
			</div>
			<div className={styles.more}>
				<Popover
					placement="top"
					trigger="click"
					visible={showActions}
					onVisibleChange={toggle}
					overlay={
						<div className={styles.more_overlay}>
							{/* <div className={styles.item} onClick={handleSwitchEnv}>
								<div className={styles.left}>
									<Icon src={Testnet} height={20} width={20} />
									<span>Testnet</span>
								</div>
								<Switch checked={isTestnetEnv} />
							</div> */}
							<div className={styles.item} onClick={handleOpenDocument}>
								<div className={styles.left}>
									<Icon src={Document} height={20} width={20} />
									<span>Document</span>
								</div>
							</div>
							<div className={styles.item} onClick={handleOpenFAQ}>
								<div className={styles.left}>
									<Icon src={FAQ} height={20} width={20} />
									<span>FAQ</span>
								</div>
							</div>
							<div className={styles.item} onClick={handleSupport}>
								<div className={styles.left}>
									<Icon src={Support} height={20} width={20} />
									<span>Support</span>
								</div>
							</div>
							<div className={styles.item} onClick={disconnect}>
								<div className={styles.left}>
									<Icon src={Disconnect} height={20} width={20} />
									<span>Disconnect</span>
								</div>
							</div>
						</div>
					}
				>
					{showActions ? (
						<div className={styles.more_item}>
							<Icon src={Close} width={20} height={20} />
							Close
						</div>
					) : (
						<div className={styles.more_item}>
							<Icon src={More} width={20} height={20} />
							More
						</div>
					)}
				</Popover>
			</div>
		</div>
	)
}

export default SideBar
