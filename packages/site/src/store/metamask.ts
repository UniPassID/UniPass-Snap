import { TokenInfo } from '@/types'
import { atom } from 'recoil'

const metamaskAccountTokenListState = atom<Array<TokenInfo>>({
	key: 'metamaskAccountTokenListState',
	default: []
})

export { metamaskAccountTokenListState }
