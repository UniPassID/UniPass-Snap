import Assets from './assets'
import Pay from './pay'
import styles from './payment.module.scss'

const Payment = () => {
	
	return (
		<div className={styles.payment}>
			<div className={styles.assets}>
				<Assets />
			</div>
			<div className={styles.pay}>
				<Pay />
			</div>
		</div>
	)
}

export default Payment
