import { useMemo, useState } from 'react'
import { BigNumber } from 'ethers'
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

	const SINGLE_GAS_RESULT = useMemo(() => {
		return [
			{
				chainId: 137,
				token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
				singleFee: BigNumber.from(100000),
				feeReceiver: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
			},
			{
				chainId: 80001,
				token: '0x87F0E95E11a49f56b329A1c143Fb22430C07332a',
				singleFee: BigNumber.from(100000),
				feeReceiver: '0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'
			},
		]
	}, [])

	useRequest(async () => {
		const res = await getSingleTransactionFees()
		setSingleFeeResult(res.fees)
	}, {
		ready: !!localStorage.getItem('up__accessToken'),
		pollingInterval: 10000,
	})

	const SINGLE_GAS = useMemo(() => {
		return singleFeeResult?.find((feeOption) => feeOption.chainId === chainId)
	}, [chainId, singleFeeResult])

	return { availableTokens, SINGLE_GAS }
}
