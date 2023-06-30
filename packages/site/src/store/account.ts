import { DEFAULT_TOKEN_LIST } from '@/constants/tokens'
import { TokenInfo } from '@/types'
import { SmartAccount } from '@unipasswallet/smart-account'
import { atom } from 'recoil'

const smartAccountState = atom<string>({
	key: 'smartAccount',
	default: ''
})

const smartAccountTokenListState = atom<Array<TokenInfo>>({
	key: 'smartAccountTokenList',
	default: DEFAULT_TOKEN_LIST
})

const smartAccountTotalBalanceState = atom<string>({
	key: 'smartAccountTotalBalance',
	default: '0.00'
})

const smartAccountInsState = atom<SmartAccount>({
	key: 'smartAccountInsState',
	default: undefined,
	dangerouslyAllowMutability: true
})

const availableFreeQuotaState = atom<number>({
	key: 'availableFreeQuota',
	default: 3
})

export {
	smartAccountState,
	smartAccountTokenListState,
	smartAccountTotalBalanceState,
	smartAccountInsState,
	availableFreeQuotaState
}
