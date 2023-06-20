import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { currentChainIdState, smartAccountTokenListState } from '@/store'

export const useTransfer = () => {
	const tokens = useRecoilValue(smartAccountTokenListState)
	const chainId = useRecoilValue(currentChainIdState)

	const availableTokens = useMemo(() => {
		return tokens.filter((token) => token.chainId === chainId)
	}, [chainId, tokens])

	return { availableTokens }
}
