import { BigNumber, Contract, ContractInterface, ContractTransaction, Signer } from 'ethers'
import { JsonRpcProvider, Provider, Web3Provider } from '@ethersproject/providers'
import { ERC20_ABI } from '@/constants'

export function makeContract<T extends Contract>(
	address: string,
	abi: ContractInterface,
	library: Web3Provider | JsonRpcProvider,
	account?: string
) {
	const signerOrProvider: Signer | Provider = account ? library.getSigner(account) : library
	return new Contract(address, abi, signerOrProvider) as T
}

export interface ERC20Contract extends Contract {
	balanceOf: (address: string) => Promise<BigNumber>
	totalSupply: () => Promise<BigNumber>
	transfer: (address: string, value: string) => Promise<ContractTransaction>
}

export function makeERC20Contract(provider: Web3Provider | JsonRpcProvider, contractAddress: string, account?: string) {
	return makeContract<ERC20Contract>(contractAddress, ERC20_ABI, provider, account)
}
