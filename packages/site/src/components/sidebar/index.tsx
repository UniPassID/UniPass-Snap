import { useBoolean } from 'ahooks'
import { useRecoilState } from 'recoil'
import clsx from 'clsx'
import { MenuType } from '@/types'
import { Icon, Popover, Switch } from '@/components'
import { currentSideBarState, isTestnetEnvState, currentChainIdState, smartAccountState } from '@/store'
import Logo from '@/assets/svg/unipass.svg'
import Payment from '@/assets/svg/Payment.svg'
import PaymentSelected from '@/assets/svg/PaymentSelected.svg'
import TopUp from '@/assets/svg/TopUp.svg'
import TopUpSelected from '@/assets/svg/TopUpSelected.svg'
import History from '@/assets/svg/History.svg'
import HistorySelected from '@/assets/svg/HistorySelected.svg'
import More from '@/assets/svg/More.svg'
import Testnet from '@/assets/svg/Testnet.svg'
import Disconnect from '@/assets/svg/Disconnect.svg'
import Close from '@/assets/svg/Close.svg'
import { ARBITRUM_MAINNET, POLYGON_MUMBAI } from '@/constants'
import styles from './sidebar.module.scss'

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
	const [, setCurrentChainIdState] = useRecoilState(currentChainIdState)
	const [currentSideBar, setCurrentSideBar] = useRecoilState(currentSideBarState)
	const [isTestnetEnv, setIsTestnetEnv] = useRecoilState(isTestnetEnvState)
	const [, setSmartAccountState] = useRecoilState(smartAccountState)

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
	}

	const handleSwitchEnv = (checked: boolean) => {
		setCurrentChainIdState(checked ? POLYGON_MUMBAI : ARBITRUM_MAINNET)
		setIsTestnetEnv(checked)
	}

	const disconnect = () => {
		window.localStorage.removeItem('up__smartAccountAddress')
		window.localStorage.removeItem('up__accessToken')
		setSmartAccountState('')
		toggle()
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
								{getMenuIcon(menu.name)}
								{menu.name}
							</div>
						)
					})}
				</div>
			</div>
			<div className={styles.menus}>
				<Popover
					placement="top"
					trigger="click"
					visible={showActions}
					onVisibleChange={toggle}
					overlay={
						<div className={styles.more_overlay}>
							<div className={styles.item}>
								<div className={styles.left}>
									<Icon src={Testnet} height={20} width={20} />
									<span>Testnet</span>
								</div>
								<Switch checked={isTestnetEnv} onChange={handleSwitchEnv} />
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
						<div className={styles.menu}>
							<Icon src={Close} width={20} height={20} />
							Close
						</div>
					) : (
						<div className={styles.menu}>
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
