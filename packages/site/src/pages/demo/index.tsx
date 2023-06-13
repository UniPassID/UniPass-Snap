import { useState } from 'react'
import { useTheme } from '@/hooks/theme-provider'
import { Button, upNotify, Dialog, Slider, Tooltip, Switch, CheckBox, Radio, Input } from '@/components'
import { useForm } from 'react-hook-form'
import styles from './_demo.module.scss'

const App: React.FC = () => {
	const { theme, toggleTheme } = useTheme()

	const [visible1, setVisible1] = useState(false)
	const [visible2, setVisible2] = useState(false)
	const [visible3, setVisible3] = useState(false)
	const [visible4, setVisible4] = useState(false)
	const [visible5, setVisible5] = useState(false)
	const [visible6, setVisible6] = useState(false)
	const [visible7, setVisible7] = useState(false)

	const methods = useForm({
		mode: 'onChange'
	})
	const { handleSubmit, ...rest } = methods
	const onSubmit = (data: any) => console.log(data)

	return (
		<div className={styles.app}>
			<div>This is UniPass Interface - Signer</div>

			<div>{theme}</div>
			<Button onClick={() => toggleTheme()}>toggleTheme</Button>
			<div>&nbsp;</div>
			<h1>Button</h1>
			<Button size="sm">test</Button>
			<Button size="md">test</Button>
			<Button size="lg">test</Button>
			<Button size="lg" disabled>
				test
			</Button>
			<div>&nbsp;</div>
			<Button size="sm" btnType="filled">
				filled
			</Button>
			<Button size="sm" btnType="filled" disabled>
				filled disabled
			</Button>
			<div>&nbsp;</div>
			<Button size="sm" btnType="gray">
				gray
			</Button>
			<Button size="sm" btnType="gray" disabled>
				gray disabled
			</Button>
			<div>&nbsp;</div>
			<Button size="sm" btnType="tinted">
				tinted
			</Button>
			<Button size="sm" btnType="tinted" disabled>
				tinted disabled
			</Button>

			<h1>Basic Alert</h1>
			<Button size="sm" onClick={() => upNotify.info('AccountPending')}>
				info
			</Button>
			<Button size="sm" onClick={() => upNotify.success('successsuccesssuccesssuccesssuccesssuccesssuccess')}>
				success
			</Button>
			<Button size="sm" onClick={() => upNotify.waiting('waiting')}>
				waiting
			</Button>
			<Button size="sm" onClick={() => upNotify.error('error')}>
				error
			</Button>

			<Button
				size="sm"
				onClick={() =>
					upNotify.closeableAlert('Title', 'messagemessagemessagemessagemessagemessagemessagemessagemessage', 10000)
				}
			>
				alert-description
			</Button>

			<Button
				size="sm"
				onClick={() =>
					upNotify.buttonAlert('Title', 'messagemessagemessagemessagemessagemessagemessagemessagemessage', 100000)
				}
			>
				alert-description
			</Button>
			<h1>Dialog</h1>
			<Button onClick={() => setVisible1(true)}>open dialog</Button>
			<Button onClick={() => setVisible4(true)}>open dialog center</Button>
			<Button onClick={() => setVisible2(true)}>dialog show confirm</Button>
			<br />
			<br />
			<Button onClick={() => setVisible5(true)}>dialog show confirm center</Button>
			<Button onClick={() => setVisible3(true)}>dialog show cancel</Button>
			<Button onClick={() => setVisible6(true)}>dialog show cancel center</Button>
			<Button onClick={() => setVisible7(true)}>extra item</Button>
			<Dialog
				title="Title"
				isOpen={visible1}
				onRequestClose={() => setVisible1(false)}
				onCancel={() => setVisible1(false)}
			>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog title="Title" isOpen={visible4} onRequestClose={() => setVisible4(false)} center={true}>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog title="Title" isOpen={visible2} onRequestClose={() => setVisible2(false)} showCancelButton={false}>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog
				title="Title"
				isOpen={visible5}
				onRequestClose={() => setVisible5(false)}
				showCancelButton={false}
				center={true}
			>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog title="Title" isOpen={visible3} onRequestClose={() => setVisible3(false)} showConfirmButton={false}>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog
				title="Title"
				isOpen={visible6}
				onRequestClose={() => setVisible6(false)}
				showConfirmButton={false}
				center={true}
			>
				Are you confirm to delete this address?
			</Dialog>
			<Dialog
				title="Title"
				isOpen={visible7}
				onRequestClose={() => setVisible7(false)}
				showConfirmButton={false}
				center={true}
				extra={<div>Continue with google</div>}
			>
				Are you confirm to delete this address?
			</Dialog>
			<h1>Slider</h1>
			<div style={{ width: '262px' }}>
				<Slider
					min={0}
					max={40}
					defaultValue={0}
					marks={{ 0: 'One Time', 10: '1h', 20: '4h', 30: '12h', 40: '24h' }}
					step={null}
					onChange={(value) => console.log(value)}
				/>
			</div>
			<h1>Tooltip</h1>
			<br />
			<br />
			<br />
			<Tooltip title="this is top title" placement="top">
				<div>top</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<Tooltip title="this is topRight title" placement="topRight">
				<div>topRight</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<Tooltip title="this is topLeft title" placement="topLeft">
				<div>topLeft</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<Tooltip title="this is bottom title" placement="bottom">
				<div>bottom</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<Tooltip title="this is bottomRight title" placement="bottomRight">
				<div>bottomRight</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<Tooltip title="this is bottomLeft title" placement="bottomLeft">
				<div>bottomLeft</div>
			</Tooltip>
			<br />
			<br />
			<br />
			<h1>Switch</h1>
			<Switch
				onChange={(value, event) => {
					console.log(`switch checked: ${value}`, event)
				}}
			/>
			<br />
			<Switch disabled checked />
			<br />
			<Switch disabled />
			<h1>Check Box</h1>
			<CheckBox
				onChange={(event) => {
					console.log(`CheckBox value: ${event.target.checked}`)
				}}
			/>
			<CheckBox disabled />
			<CheckBox disabled checked />
			<h1>Radio</h1>
			<Radio />
			<Radio disabled />
			<Radio disabled checked />
			<h1>Input</h1>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="FirstName"
					name="FirstName"
					formField={rest}
					allowClose
					validateShame={{
						maxLength: { value: 4, message: 'length <= 4' },
						required: true
					}}
				/>
				<Input
					type="text"
					placeholder="LastName"
					name="LastName"
					formField={rest}
					validateShame={{
						maxLength: { value: 4, message: 'length <= 4' },
						required: true
					}}
				/>
				<Input
					type="number"
					placeholder="InputWithNumber"
					name="InputWithNumber"
					formField={rest}
					validateShame={{
						min: { value: 4, message: 'must >= 4' },
						required: true
					}}
				/>
				<Input.Password
					placeholder="Password"
					name="password"
					formField={rest}
					allowClose
					validateShame={{
						maxLength: { value: 10, message: 'must >= 4' },
						required: true
					}}
					autoComplete="new-password"
				/>
				<Input.Code
					placeholder="Code"
					name="Code"
					formField={rest}
					autoComplete="off"
					suffix={<div>Get Code</div>}
					validateShame={{
						required: true
					}}
				/>
				<Input.Counter placeholder="Counter" name="Counter" formField={rest} autoComplete="off" />

				<Button type="submit">Submit</Button>
			</form>
		</div>
	)
}

export default App
