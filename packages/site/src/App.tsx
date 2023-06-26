import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { SideBar } from './components'
import styles from './App.module.scss'

const App: React.FC = () => {
	console.log(process.env.REACT_APP_SNAP_ORIGIN)

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
