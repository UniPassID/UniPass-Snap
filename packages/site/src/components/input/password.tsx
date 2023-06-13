import React, { useState, useMemo } from 'react'
import type { InputProps } from './input'
import Input from './input'
import { getEyeInVisibleIcon, getEyeVisibleIcon } from './icons'
import { handleErrors } from './utils'

export interface PasswordProps extends Omit<InputProps, 'suffix' | 'type'> {
	visibilityToggle?: boolean
}

const Password: React.FC<PasswordProps> = (props) => {
	const { visibilityToggle = true, ...restProps } = props

	const [visible, setVisible] = useState(false)

	const {
		formState: { errors }
	} = restProps.formField

	const { hasError } = useMemo(() => {
		return handleErrors(errors, props.name)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [errors?.[props.name], props.name])

	const toggleVisible = () => {
		if (!visibilityToggle) return
		setVisible(!visible)
	}

	const suffixIcon = (
		<div style={{ cursor: 'pointer' }} onClick={toggleVisible}>
			{visible ? getEyeVisibleIcon(hasError) : getEyeInVisibleIcon(hasError)}
		</div>
	)

	const omitProps: InputProps = {
		...restProps,
		type: visible ? 'text' : 'password',
		suffix: visibilityToggle ? suffixIcon : undefined
	}

	return <Input {...omitProps} />
}

export default Password
