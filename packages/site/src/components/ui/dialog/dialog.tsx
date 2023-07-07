import React from 'react'
import Modal, { Props } from 'react-modal'
import Close from '@/assets/svg/Close.svg'
import Icon from '../icon'

interface DialogProps extends Props {
	title?: string | React.ReactNode
	showClose?: boolean
	center?: boolean
	extraController?: React.ReactNode
	children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = (props) => {
	const { title, children, center = false, showClose = true, extraController, className, ...rest } = props

	return (
		<Modal
			bodyOpenClassName="up_dialog_body"
			overlayClassName="up_dialog_overlay"
			className={`${className} up_dialog_content`}
			contentLabel="UniPass Modal"
			closeTimeoutMS={300}
			appElement={rest.appElement || document.querySelector('body')!}
			{...rest}
		>
			{title || extraController || showClose ? (
				<div className="up_dialog_top">
					<div className="up_dialog_title" style={{ textAlign: center ? 'center' : 'left' }}>
						{title}
					</div>
					{extraController}
					{showClose ? (
						<div className="up_dialog_close" onClick={rest?.onRequestClose}>
							<Icon src={Close} width={24} height={24} />
						</div>
					) : null}
				</div>
			) : null}
			<div className="up_dialog_children" style={{ textAlign: center ? 'center' : 'left' }}>
				{children}
			</div>
		</Modal>
	)
}

export default Dialog
