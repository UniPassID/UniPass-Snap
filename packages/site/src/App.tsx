import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { SideBar } from './components'
import styles from './App.module.scss'

const App: React.FC = () => {
	return (
		<>
			<div className={styles.app}>
				<SideBar />
				<div className={styles.pages}>
					<RouterProvider router={router} />
				</div>
			</div>
		</>
	)
}

export default App
