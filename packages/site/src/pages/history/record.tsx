import { smartAccountState } from '@/store'
import { TransactionRecord } from '@/types/transaction'
import { useRecoilValue } from 'recoil'
import dayjs from 'dayjs'
import { getTokenByContractAddress } from '@/utils/transaction'
import { ARBITRUM_MAINNET, getChainNameByChainId } from '@/constants'
import Arbitrum from '@/assets/svg/Arbitrum.svg'
import Polygon from '@/assets/svg/Polygon.svg'
import USDC from '@/assets/svg/USDC.svg'
import USDT from '@/assets/svg/USDT.svg'
import { Icon } from '@/components'

const RecordDetail: React.FC<{
	record: TransactionRecord
}> = ({ record }) => {
	const address = useRecoilValue(smartAccountState)
	return (
		<div className="record">
			{record.error && <div className="error">{record.error}</div>}
			{record.txs.length > 1 &&
				record.txs.map((tx, index) => (
					<div key={`tx-record-${index}`}>
						<div className="row divider-line">
							<div>Payment {index + 1}</div>
							<div className="divider"></div>
						</div>
						<div className="row">
							<div className="label">Pay</div>
							<div className="content" style={{ fontWeight: '600' }}>
								<Icon
									width={24}
									height={24}
									style={{ marginRight: '8px' }}
									src={getTokenByContractAddress(tx.token)?.symbol === 'USDC' ? USDC : USDT}
								/>
								- {`${tx.amount} ${getTokenByContractAddress(tx.token)?.symbol}`}
							</div>
						</div>
						<div className="row">
							<div className="label">To</div>
							<div className="content">{tx.to}</div>
						</div>
					</div>
				))}
			<div className="row">
				<div className="label">Network</div>
				<div className="content" style={{ fontWeight: '600' }}>
					<Icon
						width={24}
						height={24}
						style={{ marginRight: '8px' }}
						src={record.chainId === ARBITRUM_MAINNET ? Arbitrum : Polygon}
					/>
					{getChainNameByChainId(record.chainId)}
				</div>
			</div>
			{record.txs.length === 1 && (
				<div className="row">
					<div className="label">Amount</div>
					<div className="content" style={{ fontWeight: '600' }}>
						<Icon
							width={24}
							height={24}
							style={{ marginRight: '8px' }}
							src={getTokenByContractAddress(record.txs[0].token)?.symbol === 'USDC' ? USDC : USDT}
						/>
						- {`${record.txs[0].amount} ${getTokenByContractAddress(record.txs[0].token)?.symbol}`}
					</div>
				</div>
			)}

			<div className="row">
				<div className="label">From</div>
				<div className="content">{address}</div>
			</div>
			{record.txs.length === 1 && (
				<div className="row">
					<div className="label">To</div>
					<div className="content">{record.txs[0].to}</div>
				</div>
			)}
			<div className="row">
				<div className="label">Tx Hash</div>
				<div className="content">{record.hash}</div>
			</div>
			<div className="row">
				<div className="label">Fee</div>
				<div className="content">
					{record.fee
						? `${record.fee.amount} ${
								getTokenByContractAddress(record.fee.token)?.symbol
						  }`
						: 'Free'}
				</div>
			</div>
			<div className="row">
				<div className="label">Time</div>
				<div className="content">{dayjs(record.timestamp).format('YYYY-MM-DD HH:mm')}</div>
			</div>
		</div>
	)
}

export default RecordDetail
