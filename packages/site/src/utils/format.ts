import { ethers, BigNumberish } from 'ethers'

export const weiToEther = (wei: BigNumberish, decimal = 18) => {
	return ethers.utils.formatUnits(wei, decimal)
}

export const etherToWei = (ether: string, decimal = 18) => {
	return ethers.utils.parseUnits(ether, decimal)
}

export const formatAddress = (address: string) => {
	if (!address) {
		return ''
	}
	const prefix = address.slice(0, 7)
	const suffix = address.slice(-5)
	return prefix + '...' + suffix
}
