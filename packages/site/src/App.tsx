import { RouterProvider } from 'react-router-dom'
import { useSize } from 'ahooks'
import { useRecoilState } from 'recoil'
import Confetti from 'react-confetti'
import router from '@/router'
import { SideBar } from './components'
import styles from './App.module.scss'
import { confettiState } from './store'

const App: React.FC = () => {
	const [showConfetti, setConfettiState] = useRecoilState(confettiState)
	const size = useSize(document.body)
	return (
		<>
			<div className={styles.app}>
				<div className={styles.content}>
					<SideBar />
					<div className={styles.pages}>
						<RouterProvider router={router} />
					</div>
				</div>
			</div>
			<button onClick={() => setConfettiState(!showConfetti)}>ase</button>
			<Confetti
				width={size?.width}
				height={size?.height}
				recycle={false}
				numberOfPieces={showConfetti ? 200 : 0}
				gravity={0.3}
				style={{ pointerEvents: 'none' }}
				onConfettiComplete={(confetti) => {
					setConfettiState(false)
					confetti?.reset()
				}}
			/>
		</>
	)
}

export default App
