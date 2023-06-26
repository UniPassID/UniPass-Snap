import { ethers, BigNumberish } from 'ethers'
import numbor from 'numbro'

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

export const formatUSDAmount = (input: string | number): string | number => {
	input = typeof input === 'number' ? input : parseFloat(input)
	const amount = Math.floor(input * 100) / 100
	return numbor(amount).format({ thousandSeparated: true, mantissa: 2 })
}
