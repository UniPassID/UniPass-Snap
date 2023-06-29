import { usePay } from '@/hooks/usePay'
import { useFieldArray, useForm } from 'react-hook-form'
import Transfer from './transfer'
import { Button, Dialog, Icon, upNotify } from '@/components'
import { etherToWei } from '@/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
	availableFreeQuotaState,
	currentChainIdState,
	pendingTransactionState,
	smartAccountInsState,
	smartAccountState
} from '@/store'
import { makeERC20Contract } from '@/utils/make_contract'
import { getAddress, isAddress } from 'ethers/lib/utils'
import styles from './pay.module.scss'
import { TransferRef } from './transfer'
import FeeSwitcher from '@/components/fee-switcher'
import Send from '@/assets/svg/Send.svg'
import QSvg from '@/assets/svg/Question.svg'
import { Transactions, Transaction, TransactionStatus } from '@/types/transaction'
import { addHistory } from '@/utils/history'
import { getTokenBySymbol, waitResponse } from '@/utils/transaction'
import { authorizeTransactionFees, verifyTransactionFees } from '@/request'
import numbro from 'numbro'
import ToolTip from '@/components/ui/tooltip'
import { SnapSigner } from '@/snap-signer'
import { getChainNameByChainId } from '@/constants'
import { BigNumber } from 'ethers'

const Pay: React.FC = () => {
	const { SINGLE_GAS } = usePay()
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
	const [pendingTransaction, setPendingTransaction] = useRecoilState(pendingTransactionState)

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

	// clear txs when chainId changed
	useEffect(() => {
		reset({
			txs: [DEFAULT_FORM_ITEM]
		})
	}, [DEFAULT_FORM_ITEM, reset])

	const txs = useFormReturn.watch('txs')

	const saveTransferRef = (transferRef: TransferRef | null, index: number) => {
		if (transferRef !== null) {
			transferRefs.current[index] = transferRef
		}
	}

	const gas = useMemo(() => {
		const needGas = txs.length > availableFreeQuota
		let totalGas = 0
		let originGas = 0
		let discount = txs.length > 1 ? 0.5 : 1.2
		if (needGas) {
			originGas = numbro(SINGLE_GAS?.singleFee).multiply(txs.length).value() || 0
			totalGas =
				numbro(SINGLE_GAS?.singleFee)
					.multiply(txs.length - availableFreeQuota)
					.multiply(discount)
					.value() || 0
		}
		let selectedGas = getTokenBySymbol(currentSymbol, chainId)
		const usedFreeQuota = availableFreeQuota > txs.length ? txs.length : availableFreeQuota
		return { needGas, originGas, totalGas, selectedGas, usedFreeQuota, discount }
	}, [txs.length, availableFreeQuota, SINGLE_GAS, chainId, currentSymbol])

	const showTips = useMemo(() => {
		return txs.length === 1 && availableFreeQuota === 0
	}, [txs.length, availableFreeQuota])

	const { fields, append, remove } = useFieldArray({
		control: rest.control,
		name: 'txs'
	})

	const validator = useCallback(() => {
		return txs.every((tx, index) => {
			if (!tx.amount) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Amount is required`
				})
				return false
			} else if (!transferRefs.current[index].isValidAmount()) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Insufficient balance`
				})
				return false
			} else if (!(parseFloat(tx.amount) > 0)) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Invalid amount`
				})
				return false
			}
			if (!tx.to) {
				setError(`txs.${index}.to`, {
					type: 'custom',
					message: `Address is required`
				})
				return false
			} else if (!isAddress(tx.to)) {
				setError(`txs.${index}.to`, {
					type: 'custom',
					message: `Invalid address`
				})
				return false
			}
			return true
		})
	}, [txs, setError])

	const addMore = () => {
		if (validator()) {
			transferRefs.current.forEach((transferRef) => transferRef.freeze())
			append(DEFAULT_FORM_ITEM)
		}
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

	useEffect(() => {
		if (!scrollToActiveTransfer()) {
			formBottomRef.current?.scrollIntoView({
				behavior: 'smooth'
			})
		}
	}, [fields.length])

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

	const formatTxs = (txs: Transaction[]) => {
		const contract = makeERC20Contract(getAddress(gas.selectedGas!.contractAddress))
		const formattedTxs = txs.map((tx) => {
			const data = contract.interface.encodeFunctionData('transfer', [getAddress(tx.to), etherToWei(tx.amount, 6)])
			return {
				value: '0x00',
				to: getAddress(tx.token),
				data
			}
		})
		return formattedTxs
	}

	const formatFeeTx = (feeTx: { to: string; amount: BigNumber; token: string }) => {
		const contract = makeERC20Contract(getAddress(feeTx.token))
		const data = contract.interface.encodeFunctionData('transfer', [getAddress(feeTx.to), feeTx.amount])
		const formattedFee = { value: '0x00', to: getAddress(feeTx.token), data }
		return formattedFee
	}

	const onSubmit = async () => {
		if (!validator()) return
		setIsPaying(true)
		const formattedTxs = formatTxs(txs)
		if (SINGLE_GAS) {
			try {
				let freeFeeOption
				let nonce = (await smartAccount.getNonce()).toNumber() + 1
				const fee = {
					amount: etherToWei(gas.totalGas.toString(), gas.selectedGas!.decimals),
					token: gas.selectedGas!.contractAddress,
					to: SINGLE_GAS.feeReceiver
				}

				const formattedFee = formatFeeTx(fee)
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
					fee
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
					discount: gas.discount,
					txs,
					fee
				})
				setPendingTransaction(pendingTransaction + 1)
				upNotify.success('Submitted Success')
				waitResponse(res, address, chainId)
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
		setCurrentSymbol(symbol)
	}

	return (
		<div className={styles.pay}>
			<div className={styles.content}>
				<div className={styles['title-wrapper']}>
					<div className={styles.title}>PAY</div>
					<div className={styles['sub-title']}>
						<span style={{ color: 'var(--up-primary)' }}>{availableFreeQuota} availabel gas-free</span> payments today
					</div>
				</div>
				<div className={styles.form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						{fields.map((item, index) => {
							return (
								<Transfer
									ref={(ref) => saveTransferRef(ref, index)}
									key={item.id}
									index={index}
									remove={handleRemove}
									formField={useFormReturn}
									onEdit={handleEdit}
								/>
							)
						})}
						<div className={styles['add-btn-wrapper']}>
							<Button type="button" onClick={addMore}>
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
							<ToolTip title="UniPass Snap provides three gas-free crypto payments daily" placement="topRight">
								<div className={styles['free-tips-wrap']}>
									<div className={styles['free-tips']}>Gas Free!</div>
									<Icon src={QSvg} style={{ marginLeft: '12px' }} />
								</div>
							</ToolTip>
						) : (
							gas.originGas > gas.totalGas && (
								<ToolTip
									title="UniPass Snap utilizes the batch transaction feature to save you gas fee"
									placement="topRight"
								>
									<div className={styles['free-tips-wrap']}>
										<div className={styles['free-tips']} style={{ color: '#E85050' }}>
											{gas.discount * 100}%<span style={{ color: 'var(--up-text-primary)' }}>OFF</span>
										</div>
										<Icon src={QSvg} style={{ marginLeft: '12px' }} />
									</div>
								</ToolTip>
							)
						)}
					</div>
					<div className={styles['switcher-wrapper']}>
						<div className={styles['network-fee-wrapper']}>
							<div className={styles['network-fee-total']}>$ {gas.totalGas}</div>
							{gas.originGas > gas.totalGas && <div className={styles['network-fee-origin']}>$ {gas.originGas}</div>}
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
			<Dialog
				title="Delete Payment"
				isOpen={deleteConfirm}
				onCancel={() => {
					setDeleteConfirm(false)
				}}
				onConfirm={doRemove}
				onRequestClose={() => {
					setDeleteConfirm(false)
				}}
			>
				{'Are you sure you want to delete this transaction?'}
			</Dialog>
		</div>
	)
}

export default Pay
