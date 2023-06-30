import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, FunctionComponent } from 'react'
import clsx from 'clsx'
import Loading from '@/assets/svg/loading.svg'
import { Icon } from '@/components'

export type ButtonSize = 'lg' | 'md' | 'sm'
export type ButtonType = 'filled' | 'gray' | 'tinted'

export interface BaseButtonProps {
	className?: string
	disabled?: boolean
	size?: ButtonSize
	btnType?: ButtonType
	icon?: React.ReactNode | string
	loading?: boolean
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
	type = 'button',
	icon,
	loading = false,
	children,
	...rest
}) => {
	const classes = clsx('up_button', className, {
		[`up_button_${btnType}`]: btnType,
		[`up_button_${size}`]: size,
		disabled: disabled || loading
	})

	const renderIcon = () => {
		if (loading) {
			return (
				<div className="up_button_loading">
					<Icon src={Loading} size="md" />
				</div>
			)
		}

		return icon
	}

	return (
		<button className={classes} disabled={disabled || loading} {...rest} type={type}>
			{btnType === 'filled' && <div className="up_button_mask" />}
			<div className="up_button_content">
				{renderIcon()}
				{(icon || loading) && <div className="up_button_divider"></div>}
				<span>{children}</span>
			</div>
		</button>
	)
}

export default Button
