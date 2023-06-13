import React, { useEffect } from 'react'
import type { InputProps } from './input'
import Input from './input'

export interface CodeProps extends Omit<InputProps, 'suffix' | 'type'> {
	length?: number
	suffix?: React.ReactNode
}

const Code: React.FC<CodeProps> = (props) => {
	const { length = 6, ...restProps } = props

	const { watch, reset } = props.formField

	useEffect(() => {
		const subscription = watch((value, { name: currentName }) => {
			if (currentName === props.name && value[props.name]) {
				reset(
					{ [props.name]: value[props.name].replace(/[^0-9]/g, '').slice(0, length) },
					{ keepDirty: true, keepErrors: true }
				)
			}
		})

		return () => subscription.unsubscribe()
	}, [watch, reset, length, props.name])

	return <Input {...restProps} />
}

export default Code
