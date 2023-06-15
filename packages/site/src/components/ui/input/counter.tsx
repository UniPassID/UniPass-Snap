import React, { useMemo, useEffect, InputHTMLAttributes, useRef } from 'react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'
import clsx from 'clsx'
import { handleErrors } from './utils'
import { error_message_icon, counter_decrease_icon, counter_increase_icon } from './icons'

export interface CounterProps extends InputHTMLAttributes<HTMLElement> {
	name: string
	formField: Omit<UseFormReturn<FieldValues>, 'handleSubmit'>
	inputRef?: React.MutableRefObject<HTMLInputElement | null>
	step?: number
	onCounterChange?: (value: number) => void
	disabled?: boolean
}

export type CounterRef = HTMLInputElement

const STEP_INTERVAL = 200

const Counter: React.FC<CounterProps> = (props) => {
	const { disabled, style, formField, step = 1, inputRef, onCounterChange, ...restProps } = props
	const {
		reset,
		register,
		watch,
		getValues,
		formState: { errors }
	} = formField

	const intervalId = useRef<NodeJS.Timer | null>(null)
	const { ref, ...restRegister } = { ...register(props.name) }

	const { message, hasError } = useMemo(() => {
		return handleErrors(errors, props.name)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors?.[props.name], props.name])

	useEffect(() => {
		const subscription = watch((value, { name: currentName }) => {
			if (currentName === props.name && value[props.name]) {
				reset(
					{ [props.name]: value[props.name].toString().replace(/[^\-?\d.]/g, '') },
					{ keepDirty: true, keepErrors: true }
				)
			}
		})

		return () => subscription.unsubscribe()
	}, [watch, reset, props.name])

	const wrapperClassNames = clsx('up-input-wrapper')

	const contentClassNames = clsx('up-input-content', {
		'up-input-disabled': disabled,
		'up-input-error': hasError
	})

	const increase = () => {
		const current = parseFloat(getValues(props.name) || 0)
		// TODO: check value is or not BigNumber
		reset({ [props.name]: current + step }, { keepDirty: true, keepErrors: true })
	}

	const decrease = () => {
		const current = parseFloat(getValues(props.name) || 0)
		// TODO: check value is or not BigNumber
		reset({ [props.name]: current - step }, { keepDirty: true, keepErrors: true })
	}

	const longPressIncreaseHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		increase()
		intervalId.current = setInterval(increase, STEP_INTERVAL)
	}

	const longPressDecreaseHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		decrease()
		intervalId.current = setInterval(decrease, STEP_INTERVAL)
	}

	const clearLongPressInterval = () => {
		if (intervalId.current) clearInterval(intervalId.current)
		intervalId.current = null
	}

	return (
		<div className={wrapperClassNames} style={style}>
			<span className="up-input-title">{props.name || ''}</span>
			<div className={contentClassNames}>
				<div
					className="up-input-counter-left"
					onMouseDown={longPressDecreaseHandler}
					onMouseUp={clearLongPressInterval}
					onMouseLeave={clearLongPressInterval}
				>
					{counter_decrease_icon}
				</div>
				<input
					className="up-input-inner"
					style={{ textAlign: 'center' }}
					disabled={disabled}
					{...restProps}
					{...restRegister}
					ref={(e) => {
						ref(e)
						if (inputRef) inputRef.current = e
					}}
				/>
				<div
					className="up-input-counter-right"
					onMouseDown={longPressIncreaseHandler}
					onMouseUp={clearLongPressInterval}
					onMouseLeave={clearLongPressInterval}
				>
					{counter_increase_icon}
				</div>
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

export default Counter
