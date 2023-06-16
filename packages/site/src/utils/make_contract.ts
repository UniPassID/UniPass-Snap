import { BigNumber, Contract, ContractInterface, ContractTransaction } from 'ethers'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { ERC20_ABI } from '@/constants'

export function makeContract<T extends Contract>(
	address: string,
	abi: ContractInterface,
	library?: Web3Provider | JsonRpcProvider,
	account?: string
) {
	const signerOrProvider = (account && library) ? library.getSigner(account) : library
	return new Contract(address, abi, signerOrProvider) as T
}

export interface ERC20Contract extends Contract {
	balanceOf: (address: string) => Promise<BigNumber>
	totalSupply: () => Promise<BigNumber>
	transfer: (address: string, value: string) => Promise<ContractTransaction>
}

export function makeERC20Contract(contractAddress: string, provider?: Web3Provider | JsonRpcProvider, account?: string) {
	return makeContract<ERC20Contract>(contractAddress, ERC20_ABI, provider, account)
}
