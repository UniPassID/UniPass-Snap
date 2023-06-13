import ReactDOM from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { Toaster } from '@/components'
import { ThemeProvider } from '@/hooks/theme-provider'
import reportWebVitals from '@/reportWebVitals'
import ErrorBoundary from '@/hooks/error-boundary'
import App from './App'
import '@/assets/styles/index.scss'
import { MetaMaskProvider } from '@/hooks/metamask-context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<RecoilRoot>
		<ErrorBoundary>
			<ThemeProvider>
				<Toaster />
				<MetaMaskProvider>
					<App />
				</MetaMaskProvider>
			</ThemeProvider>
		</ErrorBoundary>
	</RecoilRoot>
)

// report web vitals by g-tag
reportWebVitals()
