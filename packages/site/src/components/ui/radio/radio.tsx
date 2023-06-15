import React from 'react'
import RcCheckBox, { CheckboxProps as RcCheckboxProps, CheckboxRef } from 'rc-checkbox'

interface CheckboxProps extends RcCheckboxProps {
	children: React.ReactNode
}

const Radio = React.forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
	const { children, ...restProps } = props
	return (
		<>
			<RcCheckBox {...restProps} type="radio" prefixCls="up-radio" ref={ref} />
			{children}
		</>
	)
})

export default Radio
