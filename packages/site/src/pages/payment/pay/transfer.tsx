import { Icon, Input } from '@/components'
import { useTransfer } from '@/hooks/useTransfer'
import { UseFormReturn, useFieldArray, Controller } from 'react-hook-form'
import styles from './pay.module.scss'
import { useState, forwardRef, useImperativeHandle, useRef, useMemo, useCallback, useEffect } from 'react'
import EditSvg from '@/assets/svg/Edit.svg'
import DeleteSvg from '@/assets/svg/Delete.svg'
import USDCSvg from '@/assets/svg/USDC.svg'
import USDTSvg from '@/assets/svg/USDT.svg'
import { etherToWei, formatAddress, weiToEther } from '@/utils'
import { BigNumber } from 'ethers'
import { Transaction } from '@/types/transaction'
import Select, { Option } from 'rc-select'
import numbor from 'numbro'
import clsx from 'clsx'

export interface TransferRef {
	freeze: () => void
	isActive: () => HTMLDivElement | null
	isValidAmount: () => boolean
}

const getItemClsx = (index: number) => {
	return clsx(styles.transfer, {
		[styles['has-divider']]: index
	})
}

const Transfer = forwardRef<
	TransferRef,
	{
		formField: UseFormReturn<any>
		remove: (index: number) => void
		onEdit: () => boolean
		index?: number
	}
>(({ formField, remove, onEdit, index = 0 }, ref) => {
	const { availableTokens } = useTransfer()
	const [editable, setEditable] = useState<boolean>(true)
	const posRef = useRef<HTMLDivElement>(null)

	const { fields } = useFieldArray({
		control: formField.control,
		name: 'txs'
	})

	const txs = formField.watch('txs') as Transaction[]

	const tx = formField.watch(`txs.${index}`) as Transaction

	const handleRemove = (index: number) => {
		remove(index)
	}

	const handleEdit = () => {
		if (onEdit()) {
			setEditable(true)
		}
	}

	// auto expand
	useEffect(() => {
		if (txs.length === 1) {
			setEditable(true)
		}
	}, [txs.length])

	const getTokenContractAddress = useCallback(
		function (contractAddress: string) {
			return availableTokens.find((token) => contractAddress === token.contractAddress)
		},
		[availableTokens]
	)

	const availableBalance = useMemo(() => {
		const currentToken = getTokenContractAddress(tx.token)
		if (currentToken) {
			const totalUsed = txs.reduce((total: BigNumber, tx, currentIndex) => {
				if (currentIndex === index) {
					return total.add(0)
				}
				return total.add(
					tx.token === currentToken?.contractAddress ? etherToWei(tx.amount || '0', currentToken.decimals) : 0
				)
			}, BigNumber.from(0))
			const totalBalance =
				availableTokens.find((token) => currentToken?.contractAddress === token.contractAddress)?.balance ||
				BigNumber.from(0)
			return weiToEther(totalBalance.sub(totalUsed), currentToken.decimals)
		}
		return '0'
	}, [txs, availableTokens, index, tx.token, getTokenContractAddress])

	useImperativeHandle(
		ref,
		() => ({
			freeze: () => {
				setEditable(false)
			},
			isActive: () => {
				return posRef.current
			},
			isValidAmount: () => {
				try {
					const currentToken = getTokenContractAddress(tx.token)
					return etherToWei(availableBalance, currentToken?.decimals).gte(
						etherToWei(tx.amount || '0', currentToken?.decimals)
					)
				} catch (e) {
					return false
				}
			}
		}),
		[availableBalance, tx.token, tx.amount, getTokenContractAddress]
	)

	return (
		<div className={getItemClsx(index)} key={fields[index].id}>
			{(txs.length > 1 || !editable) ? (
				<div className={styles['sub-title']}>
					{txs.length > 1 ? <div className={styles['sub-title-txt']}>Payment{index + 1}</div> : <div></div>}
					<div className={styles.controller}>
						{txs.length > 1 && (
							<div className={styles.icon} onClick={() => handleRemove(index)}>
								<Icon src={DeleteSvg} />
							</div>
						)}
						{!editable && (
							<div className={styles.icon} onClick={() => handleEdit()}>
								<Icon src={EditSvg} />
							</div>
						)}
					</div>
				</div>
			): <div style={{height: '20px'}}></div>}

			{editable ? (
				<>
					<div ref={posRef} className={styles.row}>
						<div className={styles['token-selector-wrapper']}>
							<span className="up-select-title">TOKEN</span>
							<Controller
								control={formField.control}
								name={`txs.${index}.token`}
								render={({ field: { onChange, value } }) => (
									<Select onChange={onChange} value={value}>
										{availableTokens.map((token) => (
											<Option key={token.contractAddress} value={token.contractAddress}>
												<Icon
													src={token.symbol === 'USDC' ? USDCSvg : USDTSvg}
													style={{ marginRight: '12px' }}
													width={20}
													height={20}
												/>{' '}
												{token.symbol}
											</Option>
										))}
									</Select>
								)}
							/>
						</div>
						<div className={styles['amount-wrapper']}>
							<Input
								type="number"
								placeholder="Input amount"
								formField={formField}
								extraMessage={`AVAILABLE: ${numbor(availableBalance).format({ thousandSeparated: true, mantissa: 2 })}`}
								label="AMOUNT"
								name={`txs.${index}.amount`}
							/>
						</div>
					</div>
					<Input
						type="text"
						placeholder="Input recipient address"
						formField={formField}
						label="ADDRESS"
						name={`txs.${index}.to`}
					/>
				</>
			) : (
				<div className={styles['frozen-transfer']}>
					<div className={styles['frozen-detail']}>
						<span className={styles.desc}>Pay: </span>
						<Icon
							style={{ marginRight: '8px' }}
							width={16}
							height={16}
							src={getTokenContractAddress(tx.token)?.symbol === 'USDC' ? USDCSvg : USDTSvg}
						/>
						{tx.amount} {getTokenContractAddress(tx.token)?.symbol}
					</div>
					<div>
						<span className={styles.desc}>To: </span>
						{formatAddress(tx.to)}
					</div>
				</div>
			)}
		</div>
	)
})

export default Transfer