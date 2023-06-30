import { useEffect, useMemo, useState } from 'react'
import {
	availableFreeQuotaState,
	currentChainIdState,
	editingPaymentState,
	smartAccountState,
	smartAccountTokenListState
} from '@/store'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useRequest } from 'ahooks'
import { getSingleTransactionFees } from '@/request'
import { SingleTransactionFee } from '@/types/request'
import { Transaction, TransactionStatus } from '@/types/transaction'
import numbro from 'numbro'
import { getHistoryByStatusAndChain, getTokenByContractAddress, getTokenBySymbol, weiToEther } from '@/utils'
import { getAddress } from 'ethers/lib/utils'

export const usePay = (txs: Transaction[], currentSymbol: string) => {
	const smartAccount = useRecoilValue(smartAccountState)
	const tokens = useRecoilValue(smartAccountTokenListState)
	const chainId = useRecoilValue(currentChainIdState)
	const availableFreeQuota = useRecoilValue(availableFreeQuotaState)
	const [singleFeeResult, setSingleFeeResult] = useState<SingleTransactionFee[]>()
	const setEditingPayment = useSetRecoilState(editingPaymentState)
	const [hasPendingTransaction, setHasPendingTransaction] = useState<boolean>(false)

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
		},
		{
			ready: !!smartAccount,
			refreshDeps: [smartAccount, chainId],
			pollingInterval: 3000
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
			totalGas =
				numbro(SINGLE_GAS?.singleFee)
					.multiply(txs.length - availableFreeQuota)
					.multiply(discount)
					.value() || 0
		}
		originGas = numbro(SINGLE_GAS?.singleFee).multiply(txs.length).value() || 0
		let selectedGas = getTokenBySymbol(currentSymbol, chainId)
		const usedFreeQuota = availableFreeQuota > txs.length ? txs.length : availableFreeQuota
		const discountStatus: string = totalGas ? ((totalGas - originGas) / totalGas).toString() : 'free'
		return { needGas, originGas, totalGas, selectedGas, usedFreeQuota, discount, discountStatus }
	}, [txs.length, availableFreeQuota, SINGLE_GAS, chainId, currentSymbol])

	const getTransferAmount = () => {
		let usdcAmount = 0
		let usdtAmount = 0
		txs.forEach((tx) => {
			const symbol = getTokenByContractAddress(tx.token)?.symbol
			if (symbol === 'USDC') {
				usdcAmount += parseFloat(tx.amount) || 0
			} else {
				usdtAmount += parseFloat(tx.amount) || 0
			}
		})
		const totalAmount = usdcAmount + usdtAmount
		return { usdcAmount, usdtAmount, totalAmount }
	}

	const transferAmount = getTransferAmount()

	const isInsufficientBalance = useMemo(() => {
		const token = availableTokens.find(
			(token) => getAddress(token.contractAddress) === getAddress(gas.selectedGas?.contractAddress || '')
		)
		if (!token) return false
		if (!gas.totalGas) return false
		const tokenBalance = parseFloat(weiToEther(token.balance || 0, gas.selectedGas?.decimals))
		return gas.selectedGas?.symbol === 'USDC'
			? tokenBalance < transferAmount.usdcAmount + gas.totalGas
			: tokenBalance < transferAmount.usdtAmount + gas.totalGas
	}, [availableTokens, gas.selectedGas, transferAmount, gas.totalGas])

	const showTips = useMemo(() => {
		return txs.length === 1 && availableFreeQuota === 0
	}, [txs.length, availableFreeQuota])

	useEffect(() => {
		const isEditing = txs.length > 1 || !!(txs[0]?.amount || txs[0]?.to)
		setEditingPayment(isEditing)
	})

	return { availableTokens, SINGLE_GAS, gas, transferAmount, showTips, hasPendingTransaction, isInsufficientBalance }
}
