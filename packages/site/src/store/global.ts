import { atom } from 'recoil'
import { MenuType } from '@/types'

const currentSideBarState = atom<MenuType>({
	key: 'currentSideBarState',
	default: 'Payment'
})

const isTestnetEnvState = atom<boolean>({
	key: 'isTestnetEnvState',
	default: false
})

export { currentSideBarState, isTestnetEnvState }
