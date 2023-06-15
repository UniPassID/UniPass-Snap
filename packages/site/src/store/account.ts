import { atom } from 'recoil'

const smartAccountState = atom<string>({
	key: 'smartAccount',
	default: ''
})

const smartAccountTotalBalanceState = atom<string>({
	key: 'smartAccountTotalBalance',
	default: '0.00'
})

export { smartAccountState, smartAccountTotalBalanceState }
