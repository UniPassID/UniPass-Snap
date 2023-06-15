import React, { useMemo, InputHTMLAttributes, useCallback } from 'react'
import type { UseFormReturn, FieldValues, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'
import { handleErrors } from './utils'
import { getCloseIcon, error_message_icon } from './icons'

export interface InputProps extends InputHTMLAttributes<HTMLElement> {
	formField: Omit<UseFormReturn<any>, 'handleSubmit'>
	name: string
	label?: string
	inputRef?: React.MutableRefObject<HTMLInputElement | null>
	disabled?: boolean
	allowClose?: boolean
	suffix?: React.ReactNode
	validateShame?: RegisterOptions<FieldValues>
}

const Input: React.FC<InputProps> = (props) => {
	const { disabled, allowClose = false, suffix, style, formField, validateShame, inputRef, ...restProps } = props
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

	const reset = () => {
		resetField?.(props.name)
	}

	return (
		<div className={wrapperClassNames} style={style}>
			<span className="up-input-title">{props.label || props.name || ''}</span>
			<div className={contentClassNames}>
				<input
					className="up-input-inner"
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
