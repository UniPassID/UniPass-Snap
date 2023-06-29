import { useEffect, useMemo, useState } from 'react'
import { availableFreeQuotaState, currentChainIdState, editingPaymentState, smartAccountState, smartAccountTokenListState } from '@/store'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { getSingleTransactionFees } from '@/request'
import { SingleTransactionFee } from '@/types/request'
import { Transaction, TransactionStatus } from '@/types/transaction'
import numbro from 'numbro'
import { getHistoryByStatusAndChain, getTokenByContractAddress, getTokenBySymbol } from '@/utils'

export const usePay = (txs: Transaction[], currentSymbol: string) => {
	const smartAccount = useRecoilValue(smartAccountState)
	const tokens = useRecoilValue(smartAccountTokenListState)
	const chainId = useRecoilValue(currentChainIdState)
	const availableFreeQuota = useRecoilValue(availableFreeQuotaState)
	const [singleFeeResult, setSingleFeeResult] = useState<SingleTransactionFee[]>()
	const setEditingPayment = useSetRecoilState(editingPaymentState)
	const [hasPendingTransaction ,setHasPendingTransaction] = useState<boolean>(false)

	const availableTokens = useMemo(() => {
		return tokens.filter((token) => token.chainId === chainId)
	}, [chainId, tokens])

	useRequest(
		async () => {
			const res = await getSingleTransactionFees()
			setSingleFeeResult(res.fees)
		},
		{
			ready: !!localStorage.getItem('up__accessToken'),
			pollingInterval: 10000
		}
	)

	// polling pending transaction
	useRequest(
		async () => {
			const pendingTransactions = getHistoryByStatusAndChain(smartAccount, TransactionStatus.Pending, chainId)
			setHasPendingTransaction(!!pendingTransactions.length)
		}, {
			ready: !!(smartAccount),
			refreshDeps: [smartAccount, chainId],
			pollingInterval: 3000,
		}
	)

	const SINGLE_GAS = useMemo(() => {
		return singleFeeResult?.find((feeOption) => feeOption.chainId === chainId)
	}, [chainId, singleFeeResult])

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
		const discountStatus: string = totalGas ? ((totalGas - originGas) / totalGas).toString() : 'free'
		return { needGas, originGas, totalGas, selectedGas, usedFreeQuota, discount, discountStatus }
	}, [txs.length, availableFreeQuota, SINGLE_GAS, chainId, currentSymbol])

	const transferAmount = useMemo(() => {
		let usdcAmount = 0
		let usdtAmount = 0
		txs.forEach(tx => {
			const symbol = getTokenByContractAddress(tx.token)?.symbol
			if (symbol === 'usdc') {
				usdcAmount += (parseFloat(tx.amount) || 0)
			} else {
				usdtAmount += parseFloat(tx.amount) || 0
			}
		})
		const totalAmount = usdcAmount + usdtAmount
		return { usdcAmount, usdtAmount, totalAmount } 
	}, [txs])

	const showTips = useMemo(() => {
		return txs.length === 1 && availableFreeQuota === 0
	}, [txs.length, availableFreeQuota])

	useEffect(() => {
		if (txs.length > 1) {
			setEditingPayment(true)
			return
		}
		if (txs[0]?.amount || txs[0]?.to) setEditingPayment(true)
	}, [txs, setEditingPayment])

	return { availableTokens, SINGLE_GAS, gas, transferAmount, showTips, hasPendingTransaction }
}
