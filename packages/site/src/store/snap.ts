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

const smartAccountState = atom<string>({
	key: 'smartAccount',
	default: ''
})

export { flaskState, installedSnapState, smartAccountState }
