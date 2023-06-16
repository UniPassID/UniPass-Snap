import { useRecoilValue } from 'recoil'
import { useSnap } from '@/hooks'
import { Button, upNotify } from '@/components'
import { formatAddress } from '@/utils'
import { smartAccountState } from '@/store'
import styles from './header.module.scss'

const Header = () => {
	const { isFlask, installedSnap, handleConnectSnap } = useSnap()
	const smartAccount = useRecoilValue(smartAccountState)

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
			return (
				<Button onClick={connect} size="sm">
					Connect
				</Button>
			)
		}
	}

	return (
		<div className={styles.header}>
			<div>UniPass</div>
			<div className={styles.actions}>{renderActions()}</div>
		</div>
	)
}

export default Header
