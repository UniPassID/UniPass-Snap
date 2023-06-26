import { useRecoilValue } from 'recoil'
import { currentSideBarState } from '@/store'
import { useAccount } from '@/hooks'
import Payment from '../payment'
import TopUp from '../topup'
import History from '../history'
import StatusDialog from '@/components/status-dialog'

const Home: React.FC = () => {
	useAccount()
	const currentMenu = useRecoilValue(currentSideBarState)

	const renderContent = () => {
		switch (currentMenu) {
			case 'Payment':
				return <Payment />
			case 'TopUp':
				return <TopUp />
			case 'History':
				return <History />
		}
	}

	return (
		<>
			<StatusDialog />
			{renderContent()}
		</>
	)
}

export default Home
