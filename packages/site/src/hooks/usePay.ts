import { useMemo, useState } from 'react'
import { currentChainIdState, smartAccountTokenListState } from '@/store'
import { useRecoilValue } from 'recoil'
import { useRequest } from 'ahooks'
import { getSingleTransactionFees } from '@/request'
import { SingleTransactionFee } from '@/types/request'

export const usePay = () => {
	const tokens = useRecoilValue(smartAccountTokenListState)
	const chainId = useRecoilValue(currentChainIdState)
	const [singleFeeResult, setSingleFeeResult] = useState<SingleTransactionFee[]>()

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

	const SINGLE_GAS = useMemo(() => {
		return singleFeeResult?.find((feeOption) => feeOption.chainId === chainId)
	}, [chainId, singleFeeResult])

	return { availableTokens, SINGLE_GAS }
}
