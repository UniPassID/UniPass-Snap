/*
 *	Global Context of theme switcher
 */

import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
	theme: Theme
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextProps>({
	theme: 'dark',
	toggleTheme: () => {}
})

const useTheme = () => {
	return useContext(ThemeContext)
}

export const getDefaultTheme = () => {
	const storedTheme = localStorage.getItem('theme')
	if (storedTheme) {
		switch (storedTheme) {
			case 'dark':
				return 'dark'
			case 'light':
				return 'light'
			default:
				return 'light'
		}
	}

	// get system prefers
	const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

	return systemPrefersDark ? 'dark' : 'light'
}

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(getDefaultTheme)

	useLayoutEffect(() => {
		localStorage.setItem('theme', theme)
		// TODO: theme
		document.querySelector('body')?.setAttribute('data-theme', 'light')
	}, [theme])

	// add event listener for system prefer
	useEffect(() => {
		const mediaQueryList = window?.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = () => {
			setTheme(mediaQueryList.matches ? 'dark' : 'light')
		}

		mediaQueryList?.addEventListener('change', handleChange)

		return () => mediaQueryList?.removeEventListener('change', handleChange)
	}, [])

	const toggleTheme = (): void => {
		setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
	}

	return <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme }
