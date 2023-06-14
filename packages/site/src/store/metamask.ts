import { atom } from 'recoil'

const metamaskAccountState = atom<string>({
	key: 'metamaskAccountState',
	default: ''
})

export { metamaskAccountState }
