import { SmartAccount } from '@unipasswallet/smart-account'
import { atom } from 'recoil'

const smartAccountState = atom<string>({
	key: 'smartAccount',
	default: '',
	dangerouslyAllowMutability: true
})

const smartAccountTotalBalanceState = atom<string>({
	key: 'smartAccountTotalBalance',
	default: '0.00'
})

const smartAccountInsState = atom<SmartAccount>({
	key: 'smartAccountInsState',
	default: undefined
})

export { smartAccountState, smartAccountTotalBalanceState, smartAccountInsState }
