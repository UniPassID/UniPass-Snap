import { getHistory } from '@/utils/history'
import styles from './history.module.scss'
import Table from 'rc-table'
import { useRecoilValue } from 'recoil'
import { smartAccountState } from '@/store'
import { TransactionRecord, TransactionStatus } from '@/types/transaction'
import dayjs from 'dayjs'
import { AlignType } from 'rc-table/lib/interface'
import { formatAddress, formatUSDAmount, openExplore } from '@/utils'
import { ARBITRUM_MAINNET } from '@/constants'
import Arbitrum from '@/assets/svg/Arbitrum.svg'
import Polygon from '@/assets/svg/Polygon.svg'
import PaySvg from '@/assets/svg/PaymentSelected.svg'
import { Dialog, Icon } from '@/components'
import { useState } from 'react'
import ExploreButton from '@/assets/svg/ExploreButton.svg'
import RecordDetail from './record'
import EmptyAssets from '@/assets/svg/EmptyAssets.svg'
import './history.dialog.scss'

const columns = [
	{
		title: 'Transaction Type',
		width: 300,
		dataIndex: 'type',
		align: 'left' as AlignType,
		key: 'type',
		render: (record: TransactionRecord) => {
			return (
				<div className={styles.send}>
					<div className={styles['send-icon']}>
						<Icon width={20} height={20} src={PaySvg} />
						<div className={styles['chain-icon']}>
							<Icon width={16} height={16} src={record.chainId === ARBITRUM_MAINNET ? Arbitrum : Polygon} />
						</div>
					</div>
					<span style={{ marginLeft: '24px' }}>{record.txs.length ? 'Batch payment' : 'Sent'}</span>
					{record?.status !== TransactionStatus.Success && <div className={styles['status-tag']}>{record?.status}</div>}
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
			return (
				<>
					<span style={{ color: 'var(--up-text-third)' }}>To: </span>
					<span style={{ color: 'var(--up-text-secondary)' }}>
						{txs.length > 1 ? 'Multiple recipients' : formatAddress(txs[0].to)}
					</span>
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
	const [currentRecord, setCurrentRecord] = useState<TransactionRecord>()
	const [showDetail, setShowDetail] = useState<boolean>(false)

	const formatHistoryData = (records: TransactionRecord[]) => {
		return records.map((record) => {
			const totalAmount = record.txs.reduce((pre, current) => {
				return pre + parseFloat(current.amount)
			}, 0)
			return {
				raw: record,
				time: dayjs(record.timestamp).format('MM-DD HH:mm'),
				address: record.txs,
				type: record,
				amount: `-$ ${formatUSDAmount(totalAmount)}`
			}
		})
	}

	const showRecordDetail = (record: TransactionRecord) => {
		setCurrentRecord(record)
		setShowDetail(true)
	}

	return (
		<div className={styles.history}>
			<div className={styles.title}>PAYMENT HISTORY</div>
			<div className={styles.table}>
				<Table
					columns={columns}
					className={styles['up-table']}
					rowClassName={styles['up-table-row']}
					data={formatHistoryData(historyData)}
					emptyText=""
					scroll={{ y: 570 }}
					rowKey={(record) => {
						return `${record.raw.relayerHash}-${record.raw.chainId}`
					}}
					onRow={(record) => {
						return {
							onClick: () => {
								showRecordDetail(record.raw)
							}
						}
					}}
					sticky={true}
				/>
				{historyData.length === 0 && (
					<div className={styles.empty}>
						<Icon src={EmptyAssets} width={120} height={120} />
						<div>No activities</div>
					</div>
				)}
			</div>
			<Dialog
				title={
					<div>
						Payment Details
						{currentRecord?.status !== TransactionStatus.Success && (
							<span className="status-tag">{currentRecord?.status}</span>
						)}
					</div>
				}
				className="up-history-dialog"
				extraController={<div onClick={() => { currentRecord  && currentRecord.hash && openExplore(currentRecord.chainId, currentRecord.hash, 'tx')}}><Icon src={ExploreButton} style={{ marginRight: '20px' }} width={24} height={24}/></div>}
				showConfirmButton={false}
				showCancelButton={false}
				isOpen={showDetail}
				onRequestClose={() => {
					setShowDetail(false)
				}}
			>
				<RecordDetail record={currentRecord!} />
			</Dialog>
		</div>
	)
}

export default History
