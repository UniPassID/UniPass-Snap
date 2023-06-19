import { atom } from 'recoil'
import { MenuType } from '@/types'

const currentSideBarState = atom<MenuType>({
	key: 'currentSideBarState',
	default: 'Payment'
})

export { currentSideBarState }
