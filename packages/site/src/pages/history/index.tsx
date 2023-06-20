import { getHistory } from '@/utils/history'
import styles from './history.module.scss'
import Table from 'rc-table'
import { useRecoilValue } from 'recoil'
import { smartAccountState } from '@/store'
import { TransactionRecord } from '@/types/transaction'
import dayjs from 'dayjs'
import { AlignType } from 'rc-table/lib/interface'
import { formatAddress } from '@/utils'
import { ARBITRUM_MAINNET } from '@/constants'
import Arbitrum from '@/assets/svg/Arbitrum.svg'
import Polygon from '@/assets/svg/Polygon.svg'
import PaySvg from '@/assets/svg/PaymentSelected.svg'
import { Icon } from '@/components'

const columns = [
	{
		title: 'Transaction Type',
		width: 250,
		dataIndex: 'type',
		align: 'left' as AlignType,
		key: 'type',
		render: (chainId: number) => {
			return (
				<div className={styles.send}>
					<div className={styles['send-icon']}>
						<Icon width={20} height={20} src={PaySvg} />
						<div className={styles['chain-icon']}>
							<Icon width={16} height={16} src={chainId == ARBITRUM_MAINNET ? Arbitrum : Polygon} />
						</div>
					</div>
					<span style={{ marginLeft: '24px' }}>Sent</span>
				</div>
			)
		}
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
		width: 200,
		align: 'right' as AlignType,
		render: (txs: any) => {
			return txs.length > 1 ? (
				'Multiple recipients'
			) : (
				<>
					<span style={{ color: 'var(--up-text-third)' }}>To: </span>
					<span style={{ color: 'var(--up-text-secondary)' }}>{formatAddress(txs[0].to)}</span>
				</>
			)
		}
	},
	{
		title: 'Trading Amount',
		dataIndex: 'amount',
		width: 250,
		key: 'amount',
		align: 'center' as AlignType
	},
	{
		title: 'Time',
		dataIndex: 'time',
		key: 'time',
		align: 'right' as AlignType
	}
]

const History: React.FC = () => {
	const address = useRecoilValue(smartAccountState)
	const historyData = getHistory(address)

	const formatHistoryData = (records: TransactionRecord[]) => {
		return records.map((record) => {
			return {
				raw: record,
				time: dayjs(record.timestamp).format('MM-DD HH:mm'),
				address: record.txs,
				type: record.chainId,
				amount: record.txs.length > 1 ? '...' : `-${record.txs[0].amount} USD`
			}
		})
	}

	return (
		<div className={styles.history}>
			<div className={styles.title}>PAYMENT HISTORY</div>
			<Table
				columns={columns}
				className={styles['up-table']}
				rowClassName={styles['up-table-row']}
				data={formatHistoryData(historyData)}
				scroll={{ y: 480 }}
				onRow={(record, index) => {
					return { onClick: () => {
						console.log('row clicked', record)
					} }
				}}
				sticky={true}
			/>
		</div>
	)
}

export default History
