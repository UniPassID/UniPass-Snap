import React from 'react'
import Modal, { Props } from 'react-modal'
import { close_svg } from '../notify/icons'
import Button from '../button'

interface DialogProps extends Props {
	title?: string | React.ReactNode
	isOpen: boolean
	confirmText?: string
	showConfirmButton?: boolean
	cancelText?: string
	showCancelButton?: boolean
	showClose?: boolean
	center?: boolean
	onConfirm?: React.MouseEventHandler
	onCancel?: React.MouseEventHandler
	extra?: React.ReactNode
	extraController?: React.ReactNode
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
		showClose = true,
		onConfirm,
		onCancel,
		extra,
		extraController,
		className,
		...rest
	} = props

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
							{close_svg}
						</div>
					) : null}
				</div>
			) : null}
			<div className="up_dialog_children" style={{ textAlign: center ? 'center' : 'left' }}>
				{children}
			</div>
			{showCancelButton || showConfirmButton ? (
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
			) : null}
			{extra && <div className="up_dialog_text_button">{extra}</div>}
		</Modal>
	)
}

export default Dialog
