import { atom } from 'recoil'
import type { Snap } from '../types'

const flaskState = atom<boolean>({
	key: 'flaskState',
	default: false
})

const installedSnapState = atom<Snap | undefined>({
	key: 'installedSnapState',
	default: undefined
})

export { flaskState, installedSnapState }
