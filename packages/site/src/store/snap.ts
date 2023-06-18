import { atom } from 'recoil'
import type { Snap } from '../types'

const flaskState = atom<boolean | undefined>({
	key: 'flaskState',
	default: undefined
})

const installedSnapState = atom<Snap | undefined>({
	key: 'installedSnapState',
	default: undefined,
	dangerouslyAllowMutability: true
})

export { flaskState, installedSnapState }
