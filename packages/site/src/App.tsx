import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import styles from './App.module.scss'
import { Header } from './components'

const App: React.FC = () => {
	return (
		<div className={styles.app}>
			<Header />
			<RouterProvider router={router} />
		</div>
	)
}

export default App
