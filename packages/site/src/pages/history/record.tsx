import { smartAccountState } from '@/store'
import { TransactionRecord } from '@/types/transaction'
import { weiToEther } from '@/utils'
import { useRecoilValue } from 'recoil'
import dayjs from 'dayjs'
import { getTokenByContractAddress } from '@/utils/transaction'

const RecordDetail: React.FC<{
	record: TransactionRecord
}> = ({ record }) => {
	const address = useRecoilValue(smartAccountState)
	return (
		<div className="record">
			{record.error && <div className="error">{record.error}</div>}
			<div className="row">
				<div className="label">Amount</div>
				<div className="content">{record.txs[0].amount}</div>
			</div>
      <div className="row">
				<div className="label">From</div>
				<div className="content">{address}</div>
			</div>
      <div className="row">
				<div className="label">To</div>
				<div className="content">{record.txs[0].to}</div>
			</div>
      <div className="row">
				<div className="label">Tx Hash</div>
				<div className="content">{record.hash}</div>
			</div>
      <div className="row">
				<div className="label">Fee</div>
				<div className="content">{record.fee ? `${weiToEther(record.fee.amount, getTokenByContractAddress(record.fee.token)?.decimals)} ${getTokenByContractAddress(record.fee.token)?.symbol}` : 'Free'}</div>
			</div>
      <div className="row">
				<div className="label">Time</div>
				<div className="content">{dayjs(record.timestamp).format('YYYY-MM-DD HH:mm')}</div>
			</div>
		</div>
	)
}

export default RecordDetail
