import React, { useMemo, InputHTMLAttributes, useCallback } from 'react'
import type { UseFormReturn, FieldValues, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'
import { handleErrors } from './utils'
import { getCloseIcon, error_message_icon } from './icons'

export interface InputProps extends InputHTMLAttributes<HTMLElement> {
	formField: UseFormReturn<any>
	name: string
	label?: string
	extraMessage?: string
	extraLabel?: React.ReactNode
	inputRef?: React.MutableRefObject<HTMLInputElement | null>
	disabled?: boolean
	allowClose?: boolean
	suffix?: React.ReactNode
	validateShame?: RegisterOptions<FieldValues>
}

const Input: React.FC<InputProps> = (props) => {
	const {
		disabled,
		allowClose = true,
		suffix,
		style,
		formField,
		validateShame,
		extraLabel,
		extraMessage,
		inputRef,
		className,
		...restProps
	} = props
	const {
		resetField,
		register,
		watch,
		formState: { errors }
	} = formField

	const { ref, ...restRegister } = { ...register(props.name, validateShame) }

	const value = watch(props.name)

	const hasValue = useMemo(() => {
		return typeof value === 'string' && value.length > 0
	}, [value])

	const { message, hasError } = useCallback(() => {
		return handleErrors(errors, props.name)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors, props.name])()

	const wrapperClassNames = clsx('up-input-wrapper')

	const contentClassNames = clsx('up-input-content', {
		'up-input-disabled': disabled,
		'up-input-error': hasError
	})

	const innerClassNames = clsx('up-input-inner', className)

	const reset = () => {
		resetField?.(props.name)
	}

	return (
		<div className={wrapperClassNames} style={style}>
			<div className="up-input-title-wrapper">
				<span className="up-input-title">{props.label || props.name || ''}</span>
				{extraLabel}
			</div>
			<div className={contentClassNames}>
				<input
					className={innerClassNames}
					disabled={disabled}
					{...restProps}
					{...restRegister}
					ref={(e) => {
						ref(e)
						if (inputRef) inputRef.current = e
					}}
				/>
				{allowClose && !disabled ? (
					<div
						className="up-input-close"
						onClick={reset}
						onMouseDown={(e) => {
							e.preventDefault()
						}}
						onTouchStart={(e) => {
							e.preventDefault()
						}}
					>
						{hasValue ? getCloseIcon(hasError) : null}
					</div>
				) : null}
				{suffix ? (
					<div className="up-input-suffix" style={{ color: hasError ? '#e85050' : 'inherit' }}>
						{suffix}
					</div>
				) : null}
			</div>
			{hasError && (
				<span className="up-input-error-message">
					<span>{error_message_icon}</span>
					{message}
				</span>
			)}
		</div>
	)
}

export default Input
