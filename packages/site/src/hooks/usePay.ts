import { TokenList } from '@/constants/tokens'
import { Token } from '@/types'
import { useEffect, useState } from 'react'

export const usePay = (chainId: string, symbol: string) => {
	const [currentChain, setCurrentChain] = useState<number>(parseInt(chainId))
	const [token, setToken] = useState<Token>()

  useEffect(() => {
    const token = TokenList.find(token => token.chainId === currentChain && token.symbol === symbol)
    setToken(token)
  }, [currentChain, symbol])

	return { setToken, token, currentChain, setCurrentChain }
}
