import { atom } from 'recoil'
import { ARBITRUM_MAINNET } from '@/constants'

const currentChainIdState = atom<number>({
	key: 'currentChainState',
	default: ARBITRUM_MAINNET
})

export { currentChainIdState }
