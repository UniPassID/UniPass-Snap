import React from 'react'
import Modal, { Props } from 'react-modal'
import { close_svg } from '../notify/icons'
import Button from '../button'

interface ConfirmProps extends Props {
	title?: string | React.ReactNode
	confirmText?: string
	showConfirmButton?: boolean
	cancelText?: string
	showCancelButton?: boolean
	showClose?: boolean
	center?: boolean
	onConfirm?: React.MouseEventHandler
	onCancel?: React.MouseEventHandler
	extra?: React.ReactNode
	children: React.ReactNode
}

const Confirm: React.FC<ConfirmProps> = (props) => {
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
		className,
		...rest
	} = props

	return (
		<Modal
			bodyOpenClassName="up_dialog_body"
			overlayClassName="up_dialog_overlay"
			className={`${className} up_confirm_content`}
			contentLabel="UniPass Modal"
			closeTimeoutMS={300}
			appElement={rest.appElement || document.querySelector('body')!}
			{...rest}
		>
			<div className="up_confirm_top">
				<div className="up_confirm_title" style={{ textAlign: center ? 'center' : 'left' }}>
					{title}
				</div>
				{showClose ? (
					<div className="up_confirm_close" onClick={rest?.onRequestClose}>
						{close_svg}
					</div>
				) : null}
			</div>
			<div className="up_confirm_children" style={{ textAlign: center ? 'center' : 'left' }}>
				{children}
			</div>
			<div className="up_confirm_footer">
				{showCancelButton ? (
					<Button btnType="gray" size="sm" style={{ flex: center ? '1 1 0%' : '0 1 auto' }} onClick={onCancel}>
						{cancelText}
					</Button>
				) : null}
				{showCancelButton && showConfirmButton ? <div className="up_confirm_footer_divider"></div> : null}
				{showConfirmButton ? (
					<Button size="sm" style={{ flex: center ? '1 1 0%' : '0 1 auto' }} onClick={onConfirm}>
						{confirmText}
					</Button>
				) : null}
			</div>
			{extra && <div className="up_confirm_extra">{extra}</div>}
		</Modal>
	)
}

export default Confirm
