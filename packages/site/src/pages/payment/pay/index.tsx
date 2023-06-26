import { usePay } from '@/hooks/usePay'
import { useFieldArray, useForm } from 'react-hook-form'
import Transfer from './transfer'
import { Button, Dialog, Icon, upNotify } from '@/components'
import { etherToWei, weiToEther } from '@/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BigNumber } from 'ethers'
import { useRecoilValue } from 'recoil'
import { currentChainIdState, smartAccountInsState, smartAccountState } from '@/store'
import { makeERC20Contract } from '@/utils/make_contract'
import { getAddress, isAddress } from 'ethers/lib/utils'
import styles from './pay.module.scss'
import { TransferRef } from './transfer'
import FeeSwitcher from '@/components/fee-switcher'
import Send from '@/assets/svg/Send.svg'
import { Transactions, Transaction, TransactionStatus } from '@/types/transaction'
import { addHistory } from '@/utils/history'
import { getTokenBySymbol, waitResponse } from '@/utils/transaction'

const Pay: React.FC = () => {
	const { SINGLE_GAS } = usePay()
	const transferRefs = useRef<TransferRef[]>([])
	const chainId = useRecoilValue(currentChainIdState)
	const formBottomRef = useRef<HTMLDivElement>(null)
	const [currentSymbol, setCurrentSymbol] = useState<string>('USDT')
	const smartAccount = useRecoilValue(smartAccountInsState)
	const address = useRecoilValue(smartAccountState)
	const [isPaying, setIsPaying] = useState<boolean>(false)
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false)
	const [deletingIndex, setDeletingIndex] = useState<number>()

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

	const totalGas = useMemo(() => {
		return SINGLE_GAS?.map((gas) => {
			return {
				symbol: gas.symbol,
				token: gas.token,
				decimals: gas.decimals,
				amount: gas.amount.mul(txs.length),
				to: gas.to
			}
		})
	}, [SINGLE_GAS, txs.length])

	const selectedGas = useMemo(() => {
		return totalGas?.find((gas) => {
			return gas.symbol === currentSymbol
		})
	}, [totalGas, currentSymbol])

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
					message: `Balance is not enough`
				})
				return false
			} else if (!(parseFloat(tx.amount) > 0)) {
				setError(`txs.${index}.amount`, {
					type: 'custom',
					message: `Amount is invalid`
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
					message: `Address is invalid`
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
		const contract = makeERC20Contract(getAddress(selectedGas!.token))
		const formattedTxs = txs.map((tx) => {
			const data = contract.interface.encodeFunctionData('transfer', [getAddress(tx.to), etherToWei(tx.amount, 6)])
			return {
				value: BigNumber.from(0),
				to: getAddress(tx.token),
				data
			}
		})
		return formattedTxs
	}

	const onSubmit = async () => {
		if (!validator()) return
		const formattedTxs = formatTxs(txs)
		if (selectedGas) {
			setIsPaying(true)
			console.log('start tx', formattedTxs)
			const fee = {
				amount: selectedGas.amount,
				token: selectedGas.token,
				to: selectedGas.to
			}
			const res = await smartAccount.sendTransactionBatch(formattedTxs, {
				fee
			})
			addHistory(address, {
				hash: res.hash,
				chainId,
				status: TransactionStatus.Pending,
				timestamp: Date.now(),
				txs,
				fee
			})
			upNotify.success('Submitted Success')
			waitResponse(res, address, chainId)
			setIsPaying(false)
			reset()
		} else {
			upNotify.info('Please wait while gas is being calculated')
		}
	}

	const handleSwitchToken = (symbol: string) => {
		setCurrentSymbol(symbol)
	}

	return (
		<div className={styles.pay}>
			<div className={styles.content}>
				<div className={styles.title}>PAY</div>
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
						<Button type="button" onClick={addMore}>
							+ Add Another Payment
						</Button>
						<div ref={formBottomRef}></div>
					</form>
				</div>
			</div>
			<div className={styles.controller}>
				<div className={styles['network-fee']}>
					<div className={styles['network-fee-title']}>NETWORK FEE</div>
					<div className={styles['switcher-wrapper']}>
						<div className={styles['network-fee-total']}>
							{weiToEther(selectedGas?.amount || 0, selectedGas?.decimals)} {selectedGas?.symbol}
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
				{"Are you sure you want to delete this transaction?"}
			</Dialog>
		</div>
	)
}

export default Pay