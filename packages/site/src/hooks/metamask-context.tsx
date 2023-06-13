import { createContext, Dispatch, ReactNode, Reducer, useEffect, useReducer } from 'react'
import { isFlask, getSnap } from '@/utils'
import type { Snap } from '../types'

export type MetamaskState = {
	isFlask: boolean
	installedSnap?: Snap
	error?: Error
}

const initialState: MetamaskState = {
	isFlask: false,
	error: undefined
}

type MetamaskDispatch = { type: MetamaskActions; payload: any }

const noop = () => {}

export const MetaMaskContext = createContext<[MetamaskState, Dispatch<MetamaskDispatch>]>([initialState, noop])

export enum MetamaskActions {
	SetInstalled = 'SetInstalled',
	SetFlaskDetected = 'SetFlaskDetected',
	SetError = 'SetError'
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
	switch (action.type) {
		case MetamaskActions.SetInstalled:
			return {
				...state,
				installedSnap: action.payload
			}

		case MetamaskActions.SetFlaskDetected:
			return {
				...state,
				isFlask: action.payload
			}

		case MetamaskActions.SetError:
			return {
				...state,
				error: action.payload
			}

		default:
			return state
	}
}

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	useEffect(() => {
		async function detectFlask() {
			const isFlaskDetected = await isFlask()

			dispatch({
				type: MetamaskActions.SetFlaskDetected,
				payload: isFlaskDetected
			})
		}

		async function detectSnapInstalled() {
			const installedSnap = await getSnap()
			dispatch({
				type: MetamaskActions.SetInstalled,
				payload: installedSnap
			})
		}

		detectFlask()

		if (state.isFlask) {
			detectSnapInstalled()
		}
	}, [state.isFlask])

	useEffect(() => {
		let timeoutId: number

		if (state.error) {
			timeoutId = window.setTimeout(() => {
				dispatch({
					type: MetamaskActions.SetError,
					payload: undefined
				})
			}, 10000)
		}

		return () => {
			if (timeoutId) {
				window.clearTimeout(timeoutId)
			}
		}
	}, [state.error])

	if (typeof window === 'undefined') {
		return <>{children}</>
	}

	return <MetaMaskContext.Provider value={[state, dispatch]}>{children}</MetaMaskContext.Provider>
}
