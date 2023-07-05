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
import Copy from '@/assets/svg/Copy.svg'
import { Icon, upNotify } from '@/components'
import CopyToClipboard from 'react-copy-to-clipboard'
import numbro from 'numbro'

const RecordDetail: React.FC<{
	record: TransactionRecord
}> = ({ record }) => {
	const address = useRecoilValue(smartAccountState)
	const renderDiscount = (record: TransactionRecord) => {
		try {
			if (!record.fee) return <span style={{ color: '#4AAC4C' }}>Gas Free!</span>
			if (record.fee && record.originFee && parseFloat(record.fee.amount) < record.originFee) {
				return (
					<span>
						{`${record.fee.amount} ${getTokenByContractAddress(record.fee.token)?.symbol}`}
						<span style={{ color: '#E85050', marginLeft: '8px', fontWeight: '500' }}>
							{numbro(record.originFee)
								.subtract(parseFloat(record.fee?.amount))
								.divide(record.originFee!)
								.multiply(100)
								.format({ mantissa: 0 })}
							%
						</span>
						<span style={{ color: 'var(--up-text-primary)' }}> Off</span>
					</span>
				)
			}
			return <>{`${record.fee.amount} ${getTokenByContractAddress(record.fee.token)?.symbol}`}</>
		} catch (e) {
			return <></>
		}
	}
	return (
		<div className="record">
			{record.error && <div className="error">{record.error}</div>}
			{record.txs.length > 1 && (
				<div className="batch-records">
					{record.txs.map((tx, index) => (
						<div key={`tx-record-${index}`}>
							<div className="row divider-line">
								<div>Payment {index + 1}</div>
								<div className="divider"></div>
							</div>
							<div className="row">
								<div className="label">Pay</div>
								<div className="content primary-text" style={{ fontWeight: '600' }}>
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
								<div className="content">
									<div className="clickable-content">
										<span>{tx.to}</span>
										<CopyToClipboard text={tx.to} onCopy={() => upNotify.success('Copy Success')}>
											<span><Icon style={{ marginLeft: '8px', cursor: 'pointer' }} src={Copy} width={20} height={20} /></span>
										</CopyToClipboard>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<div className="row">
				<div className="label">Network</div>
				<div className="content primary-text" style={{ fontWeight: '600' }}>
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
					<div className="content primary-text" style={{ fontWeight: '600' }}>
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
				<div className="content">
					<div className="clickable-content">
						<span>{address}</span>
						<CopyToClipboard text={address} onCopy={() => upNotify.success('Copy Success')}>
							<span><Icon style={{ marginLeft: '8px', cursor: 'pointer' }} src={Copy} width={20} height={20} /></span>
						</CopyToClipboard>
					</div>
				</div>
			</div>
			{record.txs.length === 1 && (
				<div className="row">
					<div className="label">To</div>
					<div className="content">
						<div className="clickable-content">
							<span>{record.txs[0].to}</span>
							<CopyToClipboard text={record.txs[0].to} onCopy={() => upNotify.success('Copy Success')}>
								<span><Icon style={{ marginLeft: '8px', cursor: 'pointer' }} src={Copy} width={20} height={20} /></span>
							</CopyToClipboard>
						</div>
					</div>
				</div>
			)}
			<div className="row">
				<div className="label">Tx Hash</div>
				<div className="content">
					<div className="clickable-content">
						<span>{record.hash || '-'}</span>
						{record.hash && (
							<CopyToClipboard text={record.hash} onCopy={() => upNotify.success('Copy Success')}>
								<span><Icon style={{ marginLeft: '8px', cursor: 'pointer' }} src={Copy} width={20} height={20} /></span>
							</CopyToClipboard>
						)}
					</div>
				</div>
			</div>
			<div className="row">
				<div className="label">Fee</div>
				<div className="content primary-text">{renderDiscount(record)}</div>
			</div>
			<div className="row">
				<div className="label">Time</div>
				<div className="content">{dayjs(record.timestamp).format('YYYY-MM-DD HH:mm')}</div>
			</div>
		</div>
	)
}

export default RecordDetail
