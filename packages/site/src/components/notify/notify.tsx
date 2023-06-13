import React from 'react'
import toast, { Toast } from 'react-hot-toast'
import { error_svg, info_svg, success_svg, waiting_svg, close_svg, alert_svg } from './icons'
import Button from '../button'

const DURATION_TIME = 3000

const customNotify = (message: string, icon: React.JSX.Element, className: string, duration = DURATION_TIME) => {
	return toast.custom(
		(t: Toast) => {
			return (
				<div
					className={`up_notify ${className} ${t.visible ? 'up_notify_animation_enter' : 'up_notify_animation_leave'}`}
				>
					<div className="up_notify_wrap" style={{ textAlign: 'left' }}>
						<div className="up_notify_content">
							<span className="up_notify_icon">{icon}</span>
							<div className="up_notify_message">{message}</div>
						</div>
						<div className="up_notify_close" onClick={() => toast.dismiss(t.id)}>
							{close_svg}
						</div>
					</div>
				</div>
			)
		},
		{ duration }
	)
}

const customAlert = (title: string, message: string, duration = DURATION_TIME, closeType: 'icon' | 'button') => {
	return toast.custom(
		(t: Toast) => {
			return (
				<div className={`up_alert  ${t.visible ? 'up_notify_animation_enter' : 'up_notify_animation_leave'}`}>
					<div
						className="up_alert_wrap"
						style={{ textAlign: 'left', alignItems: closeType === 'icon' ? 'flex-start' : 'center' }}
					>
						<div className="up_alert_content">
							<span className="up_alert_icon">{alert_svg}</span>
							<div className="up_alert_messages" style={{ width: closeType === 'icon' ? '260px' : '210px' }}>
								<div className="up_alert_title">{title}</div>
								<span className="up_alert_message">{message}</span>
							</div>
						</div>
						<div className="up_alert_close" onClick={() => toast.dismiss(t.id)}>
							{closeType === 'icon' ? close_svg : <Button size="sm">Got it</Button>}
						</div>
					</div>
				</div>
			)
		},
		{ duration }
	)
}

const info = (message: string, duration = DURATION_TIME) => {
	return customNotify(message, info_svg, 'up_notify_info', duration)
}

const success = (message: string, duration = DURATION_TIME) => {
	return customNotify(message, success_svg, 'up_notify_success', duration)
}

const waiting = (message: string, duration = DURATION_TIME) => {
	return customNotify(message, waiting_svg, 'up_notify_waiting', duration)
}

const error = (message: string, duration = DURATION_TIME) => {
	return customNotify(message, error_svg, 'up_notify_error', duration)
}

const closeableAlert = (title: string, message: string, duration = DURATION_TIME) => {
	return customAlert(title, message, duration, 'icon')
}

const buttonAlert = (title: string, message: string, duration = DURATION_TIME) => {
	return customAlert(title, message, duration, 'button')
}

const upNotify = { info, success, waiting, error, closeableAlert, buttonAlert }

export default upNotify
