import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import ReactGA from 'react-ga'
import { Toaster } from '@/components'
import { ThemeProvider, ErrorBoundary } from '@/context'
import reportWebVitals from '@/reportWebVitals'
import App from './App'
import '@/assets/styles/index.scss'

if (process.env.REACT_APP_UNIPASS_GA) {
	ReactGA.initialize(process.env.REACT_APP_UNIPASS_GA, { debug: process.env.NODE_ENV === 'development' })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<RecoilRoot>
		<ErrorBoundary>
			<ThemeProvider>
				<Toaster />
				<App />
			</ThemeProvider>
		</ErrorBoundary>
	</RecoilRoot>
)

// report web vitals by g-tag
reportWebVitals()
