import { atom, selector } from 'recoil'
import { ARBITRUM_MAINNET, TESTNET_CHAIN_IDS } from '@/constants'
import { MenuType } from '@/types'
import { getHistoryByStatus } from '@/utils'

const currentSideBarState = atom<MenuType>({
	key: 'currentSideBarState',
	default: 'Payment'
})

const currentChainIdState = atom<number>({
	key: 'currentChainState',
	default: parseInt(window.localStorage.getItem('up__currentChainId') || '') || ARBITRUM_MAINNET
})

const isTestnetEnvState = selector({
	key: 'isTestnetEnvState',
	get: ({ get }) => {
		const chainId = get(currentChainIdState)
		return TESTNET_CHAIN_IDS.includes(chainId)
	}
})

const paddingTransactionState = atom<number>({
	key: 'pendingTransaction',
	default: 0
})

export { currentSideBarState, currentChainIdState, isTestnetEnvState, paddingTransactionState }
