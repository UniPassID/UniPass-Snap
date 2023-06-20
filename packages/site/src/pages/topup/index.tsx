import { useState } from 'react'
import { Balance } from './balance'
import { ReCharge } from './recharge'
import styles from './topup.module.scss'
import { useMetaMask } from '@/hooks'

const TopUp = () => {
	const [checkedAssets, setCheckAssets] = useState<string | undefined>(undefined)
	const { metamaskAccount, connect, recharge } = useMetaMask()

	return (
		<div className={styles.topup}>
			<div className={styles.balance}>
				<Balance
					checkedAssets={checkedAssets}
					metamaskAccount={metamaskAccount}
					setCheckAssets={setCheckAssets}
					connect={connect}
				/>
			</div>
			<div className={styles.recharge}>
				<ReCharge metamaskAccount={metamaskAccount} checkedAssets={checkedAssets} recharge={recharge} />
			</div>
		</div>
	)
}

export default TopUp
