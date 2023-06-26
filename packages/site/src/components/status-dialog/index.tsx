import { useRecoilValue } from 'recoil'
import { useSnap } from '@/hooks'
import { smartAccountState } from '@/store'
import { Button, Dialog, Icon } from '@/components'
import BobbleBg from '@/assets/svg/Bobble_bg.svg'
import MetaMask from '@/assets/svg/MetaMask.svg'
import UniPass_Icon from '@/assets/svg/UniPass_Icon.svg'
import MetaMask_Linear from '@/assets/svg/MetaMask_Linear_White.svg'
import Connect from '@/assets/svg/Connect.svg'
import Gift from '@/assets/svg/Gift.svg'
import BankCard from '@/assets/svg/BankCard.svg'
import DimensionalCode from '@/assets/svg/DimensionalCode.svg'
import SocialRecovery from '@/assets/svg/SocialRecovery.svg'
import styles from './status-dialog.module.scss'
import { useMemo } from 'react'

const StatusDialog = () => {
	const { isFlask, installedSnap, handleConnectSnap, connectSnapLoading } = useSnap()
	const smartAccount = useRecoilValue(smartAccountState)

	const installFlask = () => {
		window.open('https://metamask.io/flask/', '_blank')
	}

	const connect = async () => {
		await handleConnectSnap()
	}

	const showMetaMaskInstallDialog = useMemo(() => {
		return typeof isFlask === 'boolean' && !isFlask
	}, [isFlask])

	const showSnapConnectDialog = useMemo(() => {
		if (showMetaMaskInstallDialog) return false
		return !smartAccount || !installedSnap
	}, [showMetaMaskInstallDialog, smartAccount, installedSnap])

	return (
		<>
			<Dialog
				title=""
				isOpen={showMetaMaskInstallDialog}
				shouldCloseOnEsc={false}
				shouldCloseOnOverlayClick={false}
				showConfirmButton={false}
				showCancelButton={false}
				showClose={false}
				center={true}
				className={styles.metamask_dialog}
			>
				<div className={styles.bg}>
					<Icon src={BobbleBg} width={300} height={140} />
					<div className={styles.metamask}>
						<Icon src={MetaMask} width={60} height={60} />
					</div>
				</div>
				<div className={styles.title}>Install MetaMask</div>
				<div className={styles.tips}>Before using UniPass Snap, you need to install MetaMask first.</div>
				<div className={styles.button} onClick={installFlask}>
					<Icon src={MetaMask_Linear} width={20} height={20} />
					Install MetaMask
				</div>
				<div className={styles.alert}>Please refresh this page after the installation.</div>
			</Dialog>
			<Dialog
				isOpen={showSnapConnectDialog}
				title=""
				shouldCloseOnEsc={false}
				shouldCloseOnOverlayClick={false}
				showConfirmButton={false}
				showCancelButton={false}
				showClose={false}
				center={true}
				className={styles.snap_dialog}
			>
				<div className={styles.title}>Connect to UniPass Snap</div>
				<div className={styles.tips}>UniPass Snap is a product that empowers MetaMask with smart contract wallet.</div>
				<div className={styles.pair}>
					<div className={styles.item}>
						<Icon src={UniPass_Icon} width={40} height={40} />
					</div>
					<div className={styles.divider}>
						<i></i>
						<i></i>
						<i></i>
					</div>
					<div className={styles.item}>
						<Icon src={MetaMask} width={40} height={40} />
					</div>
				</div>
				<div className={styles.feature}>Available features</div>
				<div className={styles.feature_item}>
					<Icon src={Gift} width={20} height={20} />
					Gas-free payment
				</div>
				<div className={styles.feature}>Upcoming features</div>
				<div className={styles.feature_item}>
					<Icon src={BankCard} width={20} height={20} />
					Subscription payments
				</div>
				<div className={styles.feature_item}>
					<Icon src={DimensionalCode} width={20} height={20} />
					Gas-free receipt codes
				</div>
				<div className={styles.feature_item}>
					<Icon src={SocialRecovery} width={20} height={20} />
					Social recovery
				</div>
				<Button
					style={{ width: '100%' }}
					icon={<Icon src={Connect} width={20} height={20} />}
					loading={connectSnapLoading}
					onClick={connect}
				>
					Connect Snap
				</Button>
			</Dialog>
		</>
	)
}

export default StatusDialog
