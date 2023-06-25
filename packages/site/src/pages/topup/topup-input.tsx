import React, { useMemo, InputHTMLAttributes, useCallback } from 'react'
import type { UseFormReturn, FieldValues, RegisterOptions } from 'react-hook-form'
import clsx from 'clsx'
import { error_message_icon, getCloseIcon } from '@/components/ui/input/icons'
import { handleErrors } from '@/components/ui/input/utils'
import styles from './topup.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLElement> {
	formField: UseFormReturn<any>
	name: string
	inputRef?: React.MutableRefObject<HTMLInputElement | null>
	validateShame?: RegisterOptions<FieldValues>
}

const Input: React.FC<InputProps> = (props) => {
	const { formField, validateShame, inputRef, ...restProps } = props
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

	const wrapperClassNames = clsx(styles.topup_input, {
		[styles.topup_input_error]: hasError
	})

	const contentClassNames = clsx(styles.topup_input_content, {
		[styles.topup_input_error]: hasError
	})

	const handleResetField = () => {
		resetField?.(props.name)
	}

	return (
		<div className={wrapperClassNames}>
			<span className={styles.topup_input_title}>{props.name}</span>
			<div className={contentClassNames}>
				<input
					className={styles.up_input_inner}
					{...restProps}
					{...restRegister}
					placeholder="0"
					ref={(e) => {
						ref(e)
						if (inputRef) inputRef.current = e
					}}
				/>
				<div
					className={styles.up_input_close}
					style={{ visibility: hasValue ? 'visible' : 'hidden' }}
					onClick={handleResetField}
					onMouseDown={(e) => {
						e.preventDefault()
					}}
					onTouchStart={(e) => {
						e.preventDefault()
					}}
				>
					{hasValue ? getCloseIcon(hasError) : null}
				</div>
			</div>
			{hasError && (
				<span className={styles.up_input_error_message}>
					<span>{error_message_icon}</span>
					{message}
				</span>
			)}
		</div>
	)
}

export default Input
