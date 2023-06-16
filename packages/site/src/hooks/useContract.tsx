import { useCallback, useMemo } from 'react'
import { BigNumber, Contract } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { ERC20_ABI } from '@/constants'

export const useContract = (contractAddress: string) => {

	const contract = useMemo(() => {
		return new Contract(getAddress(contractAddress), ERC20_ABI)
	}, [contractAddress])

	const encodeTransfer = useCallback(
		(address: string, amount: BigNumber) => {
			return contract.interface.encodeFunctionData('transfer', [getAddress(address), amount])
		},
		[contract]
	)

	return { contract, encodeTransfer }
}
