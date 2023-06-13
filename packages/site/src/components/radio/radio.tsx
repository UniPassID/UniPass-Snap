import React from 'react'
import RcCheckBox, { CheckboxProps } from 'rc-checkbox'

const Radio: React.FC<CheckboxProps> = (props) => {
	return <RcCheckBox {...props} prefixCls="up-radio" />
}

export default Radio
