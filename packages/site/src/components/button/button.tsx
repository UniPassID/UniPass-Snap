import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, FunctionComponent } from 'react'
import clsx from 'clsx'

export type ButtonSize = 'lg' | 'md' | 'sm'
export type ButtonType = 'filled' | 'gray' | 'tinted'

export interface BaseButtonProps {
	className?: string
	disabled?: boolean
	size?: ButtonSize
	btnType?: ButtonType
	icon?: React.ReactNode | string
	children: React.ReactNode
}

type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: FunctionComponent<ButtonProps> = ({
	className,
	disabled,
	btnType = 'filled',
	size = 'md',
	icon,
	children,
	...rest
}) => {
	const classes = clsx('up_button', className, {
		[`up_button_${btnType}`]: btnType,
		[`up_button_${size}`]: size,
		disabled
	})

	return (
		<button className={classes} disabled={disabled} {...rest}>
			<div className="up_button_content">
				{icon}
				<span>{children}</span>
			</div>
			<div className="up_button_mask" />
		</button>
	)
}

export default Button
