import React from 'react'
import Modal, { Props } from 'react-modal'
import { close_svg } from '../notify/icons'
import Button from '../button'

interface DialogProps extends Props {
	title: string
	isOpen: boolean
	confirmText?: string
	showConfirmButton?: boolean
	cancelText?: string
	showCancelButton?: boolean
	center?: boolean
	onConfirm?: React.MouseEventHandler
	onCancel?: React.MouseEventHandler
	extra?: React.ReactNode
	children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = (props) => {
	const {
		title,
		children,
		showConfirmButton = true,
		showCancelButton = true,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		center = false,
		onConfirm,
		onCancel,
		extra,
		...rest
	} = props

	return (
		<Modal
			bodyOpenClassName="up_dialog_body"
			overlayClassName="up_dialog_overlay"
			className="up_dialog_content"
			contentLabel="UniPass Modal"
			closeTimeoutMS={300}
			appElement={rest.appElement || document.querySelector('body')!}
			{...rest}
		>
			<div className="up_dialog_top">
				<div className="up_dialog_title" style={{ textAlign: center ? 'center' : 'left' }}>
					{title}
				</div>
				<div className="up_dialog_close" onClick={rest?.onRequestClose}>
					{close_svg}
				</div>
			</div>
			<div className="up_dialog_children">{children}</div>
			<div className="up_dialog_footer">
				{showCancelButton ? (
					<Button btnType="gray" size="sm" style={{ flex: center ? '1 1 0%' : '0 1 auto' }} onClick={onCancel}>
						{cancelText}
					</Button>
				) : null}
				{showCancelButton && showConfirmButton ? <div className="up_dialog_footer_divider"></div> : null}
				{showConfirmButton ? (
					<Button size="sm" style={{ flex: center ? '1 1 0%' : '0 1 auto' }} onClick={onConfirm}>
						{confirmText}
					</Button>
				) : null}
			</div>
			<div className="up_dialog_text_button">{extra || null}</div>
		</Modal>
	)
}

export default Dialog
