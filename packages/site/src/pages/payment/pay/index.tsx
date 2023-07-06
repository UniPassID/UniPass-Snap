import { usePay } from '@/hooks/usePay'
import { useFieldArray, useForm } from 'react-hook-form'
import Transfer from './transfer'
import { Button, Confirm, Dialog, Icon, upNotify } from '@/components'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
	availableFreeQuotaState,
	confettiState,
	currentChainIdState,
	pendingTransactionState,
	smartAccountInsState,
	smartAccountState
} from '@/store'
import { isAddress } from 'ethers/lib/utils'
import styles from './pay.module.scss'
import { TransferRef } from './transfer'
import FeeSwitcher from '@/components/fee-switcher'
import { Transactions, TransactionStatus } from '@/types/transaction'
import { addHistory } from '@/utils/history'
import { formatTx, formatTxs, getTokenByContractAddress, getTokenBySymbol } from '@/utils/transaction'
import { authorizeTransactionFees, verifyTransactionFees } from '@/request'
import numbro from 'numbro'
import ToolTip from '@/components/ui/tooltip'
import { SnapSigner } from '@/snap-signer'
import { getChainNameByChainId } from '@/constants'
import { etherToWei, upGA } from '@/utils'
import { useBoolean } from 'ahooks'
import Send from '@/assets/svg/Send.svg'
import QSvg from '@/assets/svg/Question.svg'
import RecoverySvg from '@/assets/svg/recovery.svg'

const MAX_TRANSACTION_LENGTH = 10

const Pay: React.FC = () => {
	const transferRefs = useRef<TransferRef[]>([])
	const chainId = useRecoilValue(currentChainIdState)
	const availableFreeQuota = useRecoilValue(availableFreeQuotaState)
	const formBottomRef = useRef<HTMLDivElement>(null)
	const [currentSymbol, setCurrentSymbol] = useState<string>('USDT')
	const smartAccount = useRecoilValue(smartAccountInsState)
	const address = useRecoilValue(smartAccountState)
	const [isPaying, setIsPaying] = useState<boolean>(false)
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false)
	const [deletingIndex, setDeletingIndex] = useState<number>()
	const [payAmount, setPayAmount] = useState<number>()
	const [currentAvailableQuota, setCurrentAvailableQuota] = useState<number>()
	const [pendingTransaction, setPendingTransaction] = useRecoilState(pendingTransactionState)
	const [isSubmitDialogOpen, { setTrue: openSubmitDialog, setFalse: closeSubmitDialog }] = useBoolean(false)
	const setConfettiState = useSetRecoilState(confettiState)

	const DEFAULT_FORM_ITEM = useMemo(() => {
		return {
			amount: '',
			to: '',
			token: getTokenBySymbol('USDT', chainId)?.contractAddress || ''
		}
	}, [chainId])

	const useFormReturn = useForm<Transactions>({
		mode: 'onChange',
		defaultValues: {
			txs: [DEFAULT_FORM_ITEM]
		}
	})

	const { handleSubmit, watch, setError, reset, ...rest } = useFormReturn

	const txs = useFormReturn.watch('txs')

	const { SINGLE_GAS, gas, transferAmount, showTips, hasPendingTransaction, isInsufficientBalance } = usePay(
		txs,
		currentSymbol
	)

	const saveTransferRef = (transferRef: TransferRef | null, index: number) => {
		if (transferRef !== null) {
			transferRefs.current[index] = transferRef
		}
	}

	const { append, remove } = useFieldArray({
		control: rest.control,
		name: 'txs'
	})

	const validator = useCallback(() => {
		let isValid = true
		txs.forEach((tx, index) => {
			if (!tx.amount) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Amount is required`
				})
				isValid = false
			}  else if (!(parseFloat(tx.amount) > 0)) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Invalid amount`
				})
				isValid = false
			} else if (!transferRefs.current[index].isValidAmount()) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Insufficient balance`
				})
				isValid = false
			}
			if (!tx.to) {
				setError(`txs.${index}.to`, {
					type: 'custom',
					message: `Address is required`
				})
				isValid = false
			} else if (!isAddress(tx.to)) {
				setError(`txs.${index}.to`, {
					type: 'custom',
					message: `Invalid address`
				})
				isValid = false
			}
		})
		return isValid
	}, [txs, setError])

	const addMore = () => {
		const isValid = validator() && txs.length < MAX_TRANSACTION_LENGTH
		if (isValid) {
			transferRefs.current.forEach((transferRef) => transferRef.freeze())
			append(DEFAULT_FORM_ITEM)
		}
		if (txs.length === MAX_TRANSACTION_LENGTH) {
			upNotify.error('A maximum of 10 payments can be sent in one batch transaction')
		}
		upGA('payment-click-add_another_payment', 'payment', {
			ClickResult: isValid,
			BatchAmount: txs.length,
			GasToken: currentSymbol,
			GasAmount: gas.totalGas,
			DiscountStatus: gas.discountStatus
		})
	}

	const scrollToActiveTransfer = () => {
		const activeTransfer = transferRefs.current.find((transferRef) => {
			return transferRef?.isActive() !== null
		})
		if (activeTransfer) {
			activeTransfer.isActive()?.scrollIntoView({
				behavior: 'smooth'
			})
			return true
		}
		return false
	}

	const handleRemove = (index: number) => {
		setDeletingIndex(index)
		setDeleteConfirm(true)
	}

	const doRemove = () => {
		remove(deletingIndex)
		setDeleteConfirm(false)
	}

	const handleEdit = (): boolean => {
		if (validator()) {
			transferRefs.current.forEach((transferRef) => transferRef?.freeze())
			return true
		}
		scrollToActiveTransfer()
		return false
	}

	const onSubmit = async () => {
		const isValid = validator()
		upGA('payment-click-pay', 'payment', {
			ClickResult: isValid && !hasPendingTransaction && !isInsufficientBalance,
			BatchAmount: txs.length,
			PaymentAmount: transferAmount.totalAmount,
			GasToken: currentSymbol,
			DiscountStatus: gas.discountStatus,
			SnapAddress: `_${address}`
		})
		if (hasPendingTransaction) {
			upNotify.error('The current chain has ongoing transactions. Please wait.')
			return
		}
		if (isInsufficientBalance) {
			upNotify.error('Insufficient balance. Please check.')
			return
		}
		if (!isValid) return
		if (SINGLE_GAS) {
			setPayAmount(transferAmount.totalAmount)
			setCurrentAvailableQuota(availableFreeQuota - gas.usedFreeQuota)
			try {
				setIsPaying(true)
				const formattedTxs = formatTxs(txs)
				let freeFeeOption
				const originFee = gas.totalGas
					? {
							amount: gas.totalGas.toString(),
							token: gas.selectedGas!.contractAddress,
							to: SINGLE_GAS.feeReceiver
					  }
					: undefined
				const formattedFee = originFee && formatTx(originFee)
				let nonce = (await smartAccount.getNonce()).toNumber() + 1
				const txOption = {
					transactions: formattedTxs,
					feeTransaction: formattedFee,
					nonce: nonce,
					chainId: chainId,
					usedFreeQuota: gas.usedFreeQuota,
					tokenSingleFees: [
						{
							token: SINGLE_GAS.token,
							singleFee: SINGLE_GAS.singleFee
						}
					]
				}

				// verify txs first
				if (gas.usedFreeQuota) {
					const result = await verifyTransactionFees(txOption)
					if (!result.success) throw new Error(result.errorReason)
				}
				const signer = smartAccount.getSigner() as SnapSigner
				signer.setOriginTransaction({
					transactions: txs,
					chain: getChainNameByChainId(chainId),
					fee: {
						symbol: currentSymbol,
						amount: gas.totalGas.toString()
					}
				})

				const signedTxs = await smartAccount.signTransactions(formatTxs(txs), {
					fee: originFee
						? {
								...originFee,
								amount: etherToWei(originFee.amount, getTokenByContractAddress(originFee.token)?.decimals)
						  }
						: undefined
				})

				if (gas.usedFreeQuota) {
					const { freeSig, expires } = await authorizeTransactionFees(txOption)
					freeFeeOption = {
						signature: freeSig,
						expires
					}
				}
				const res = await smartAccount.sendSignedTransactions({
					...signedTxs,
					freeFeeOption
				})
				addHistory(address, {
					relayerHash: res.hash,
					chainId,
					status: TransactionStatus.Pending,
					timestamp: Date.now(),
					originFee: gas.originGas,
					txs,
					fee: originFee
				})
				setPendingTransaction(pendingTransaction + 1)
				upGA('payment-submitted-success', 'payment', {
					ChainID: chainId,
					PaymentAmount: transferAmount.totalAmount,
					GasToken: currentSymbol,
					BatchAmount: txs.length,
					GasAmount: gas.totalGas,
					DiscountStatus: gas.discountStatus,
					SnapAddress: `_${address}`
				})
				if (gas.usedFreeQuota) {
					openSubmitDialog()
					setConfettiState(true)
				} else {
					upNotify.success('Submitted Success')
				}
				setIsPaying(false)
				reset()
			} catch (e: any) {
				upNotify.error(e?.rawMessage || e?.message || 'Something wrong, please retry')
			}
		} else {
			upNotify.info('Calculating gas, please wait.')
		}
		setIsPaying(false)
	}

	const handleSwitchToken = (symbol: string) => {
		upGA('payment-change-gas_token', 'payment', {
			BatchAmount: txs.length,
			GasToken: symbol
		})
		setCurrentSymbol(symbol)
	}

	useEffect(() => {
		if (!scrollToActiveTransfer()) {
			formBottomRef.current?.scrollIntoView({
				behavior: 'smooth'
			})
		}
	}, [txs.length])

	// clear txs when chainId changed
	useEffect(() => {
		reset({
			txs: [DEFAULT_FORM_ITEM]
		})
	}, [DEFAULT_FORM_ITEM, reset])

	return (
		<div className={styles.pay}>
			<div className={styles.content}>
				<div className={styles['title-wrapper']}>
					<div className={styles.title}>PAY</div>
					<div className={styles['sub-title']}>
						<span style={{ fontSize: '16px', fontWeight: 600 }}>{availableFreeQuota}</span>
						<span style={{ fontWeight: 500, margin: '0 4px' }}>gas-free</span>
						<span style={{ color: '#5E5F6E' }}>payment{availableFreeQuota > 1 && 's'} left today</span>
					</div>
				</div>
				<div className={styles.form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						{txs.map((_, index) => {
							return (
								<Transfer
									ref={(ref) => saveTransferRef(ref, index)}
									index={index}
									key={`tx-${index}`}
									remove={handleRemove}
									formField={useFormReturn}
									onEdit={handleEdit}
								/>
							)
						})}
						<div className={styles['add-btn-wrapper']}>
							<Button type="button" btnType="tinted" onClick={addMore}>
								+ Add Another Payment
							</Button>
							{showTips && <div className={styles['discount-tip']}>Add more for 50% gas off</div>}
						</div>
						<div ref={formBottomRef}></div>
					</form>
				</div>
			</div>
			<div className={styles.controller}>
				<div className={styles['network-fee']}>
					<div className={styles['network-fee-title-wrapper']}>
						<div className={styles['network-fee-title']}>NETWORK FEE</div>
						{gas.totalGas === 0 ? (
							<div className={styles['free-tips-wrap']}>
								<div className={styles['free-tips']}>Gas Free!</div>
								<ToolTip title="UniPass Snap provides three gas-free crypto payments every day" placement="topRight">
									<span>
										<Icon src={QSvg} style={{ marginLeft: '12px' }} />
									</span>
								</ToolTip>
							</div>
						) : (
							gas.originGas > gas.totalGas && (
								<div className={styles['free-tips-wrap']}>
									<div className={styles['free-tips-warn']}>
										<span>
											{numbro(gas.originGas)
												.subtract(gas.totalGas)
												.divide(gas.originGas)
												.multiply(100)
												.format({ mantissa: 0 })}
											%<span style={{ color: 'var(--up-text-primary)' }}> OFF</span>
										</span>
									</div>
									<ToolTip
										title="UniPass Snap utilizes the batch transaction feature to save you gas fee"
										placement="topRight"
									>
										<span>
											<Icon src={QSvg} style={{ marginLeft: '12px' }} />
										</span>
									</ToolTip>
								</div>
							)
						)}
					</div>
					<div className={styles['switcher-wrapper']}>
						<div className={styles['network-fee-wrapper']}>
							<div className={styles['network-fee-total']}>$ {gas.totalGas}</div>
							{isInsufficientBalance ? (
								<div className={styles['insufficient-tips']}>Insufficient balance</div>
							) : (
								gas.originGas > gas.totalGas && <div className={styles['network-fee-origin']}>$ {gas.originGas}</div>
							)}
						</div>
						<div className={styles.switcher}>
							<div className={styles['switch-label']}>Pay with</div>
							<FeeSwitcher onSwitchToken={handleSwitchToken} />
						</div>
					</div>

					<Button
						className={styles['pay-btn']}
						loading={isPaying}
						size="md"
						icon={<Icon src={Send} size="md" />}
						type="submit"
						onClick={onSubmit}
					>
						Pay
					</Button>
				</div>
			</div>
			<Confirm
				title="Delete Payment"
				isOpen={deleteConfirm}
				onCancel={() => {
					setDeleteConfirm(false)
				}}
				center
				onConfirm={doRemove}
				onRequestClose={() => {
					setDeleteConfirm(false)
				}}
			>
				Are you sure you want to delete this transaction?
			</Confirm>
			<Dialog
				title=""
				isOpen={isSubmitDialogOpen}
				shouldCloseOnEsc={false}
				shouldCloseOnOverlayClick={false}
				showClose={false}
				center={true}
				className={styles.submit_dialog}
			>
				<div className={styles.content}>
					<div className={styles.bg}>
						<div className={styles.metamask}>
							<Icon src={RecoverySvg} width={60} height={60} />
						</div>
					</div>
					<div className={styles.title}>Congratulations !</div>
					<div className={styles.tips}>
						You have successfully sent a gas-free payment of {payAmount} USD.
						{!!currentAvailableQuota && (
							<>
								There are still <span style={{ color: '#8864FF', fontWeight: '500' }}>{currentAvailableQuota} available gas-free</span>{' '}
								payment{currentAvailableQuota > 1 ? 's' : ''}.
							</>
						)}
					</div>
					<Button onClick={closeSubmitDialog} style={{ width: '100%' }}>
						Close
					</Button>
				</div>
			</Dialog>
		</div>
	)
}

export default Pay
