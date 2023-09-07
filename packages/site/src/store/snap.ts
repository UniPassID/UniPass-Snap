import { atom } from 'recoil'
import type { Snap } from '../types'

const metaMaskState = atom<boolean | undefined>({
	key: 'metaMaskState',
	default: undefined
})

const installedSnapState = atom<Snap | undefined>({
	key: 'installedSnapState',
	default: undefined,
	dangerouslyAllowMutability: true
})

export { metaMaskState, installedSnapState }
