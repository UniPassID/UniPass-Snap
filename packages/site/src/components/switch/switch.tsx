import React from 'react'
import RcSwitch from 'rc-switch'

export declare type SwitchChangeEventHandler = (
	checked: boolean,
	event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>
) => void
export declare type SwitchClickEventHandler = SwitchChangeEventHandler

interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
	className?: string
	prefixCls?: string
	disabled?: boolean
	checkedChildren?: React.ReactNode
	unCheckedChildren?: React.ReactNode
	onChange?: SwitchChangeEventHandler
	onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
	onClick?: SwitchClickEventHandler
	tabIndex?: number
	checked?: boolean
	defaultChecked?: boolean
	loadingIcon?: React.ReactNode
	style?: React.CSSProperties
	title?: string
}

const Switch: React.FC<SwitchProps> = (props) => {
	return <RcSwitch {...props} prefixCls="up-switch" />
}

export default Switch
