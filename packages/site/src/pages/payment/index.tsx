import Assets from './assets'
import Pay from './pay'
import styles from './payment.module.scss'

const Payment = () => {
	return (
		<div className={styles.payment}>
			<div className={styles.overview}>
				<Assets />
			</div>
			<Pay />
		</div>
	)
}

export default Payment
