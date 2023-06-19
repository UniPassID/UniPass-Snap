import { useRecoilValue, useRecoilState } from 'recoil'
import clsx from 'clsx'
import { MenuType } from '@/types'
import { useAccount, useSnap } from '@/hooks'
import { Button, Icon, Switch, upNotify } from '@/components'
import { smartAccountState, currentSideBarState, isTestnetEnvState, currentChainIdState } from '@/store'
import Logo from '@/assets/svg/unipass.svg'
import Payment from '@/assets/svg/Payment.svg'
import PaymentSelected from '@/assets/svg/PaymentSelected.svg'
import TopUp from '@/assets/svg/TopUp.svg'
import TopUpSelected from '@/assets/svg/TopUpSelected.svg'
import History from '@/assets/svg/History.svg'
import HistorySelected from '@/assets/svg/HistorySelected.svg'
import More from '@/assets/svg/More.svg'
import styles from './sidebar.module.scss'
import { formatAddress } from '@/utils'
import { ARBITRUM_MAINNET, POLYGON_MUMBAI } from '@/constants'

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
	const { isFlask, installedSnap, handleConnectSnap } = useSnap()
	const smartAccount = useRecoilValue(smartAccountState)
	const { handleQueryERC20Balance } = useAccount()
	const [, setCurrentChainIdState] = useRecoilState(currentChainIdState)
	const [currentSideBar, setCurrentSideBar] = useRecoilState(currentSideBarState)
	const [isTestnetEnv, setIsTestnetEnv] = useRecoilState(isTestnetEnvState)

	const installFlask = () => {
		window.open('https://metamask.io/flask/', '_blank')
	}

	const connect = async () => {
		await handleConnectSnap()
		upNotify.success('connect success')
	}

	const renderActions = () => {
		if (isFlask == null) {
			return null
		}

		if (!installedSnap) {
			return (
				<Button onClick={connect} size="sm">
					Connect
				</Button>
			)
		}

		if (smartAccount) {
			return <span>{formatAddress(smartAccount)}</span>
		}

		if (!isFlask) {
			return (
				<Button onClick={installFlask} size="sm">
					Install MetaMask(Snap)
				</Button>
			)
		} else {
			return null
		}
	}

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
				{/* <div className={styles.menu}> */}
				{/* <Icon src={More} width={20} height={20} />
					More */}
				{renderActions()}
				<br />
				<Switch checked={isTestnetEnv} onChange={handleSwitchEnv} />
				<span>Testnet</span>
				{/* </div> */}
			</div>
		</div>
	)
}

export default SideBar
