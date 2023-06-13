import React from 'react'
import RcCheckBox, { CheckboxProps } from 'rc-checkbox'

const CheckBox: React.FC<CheckboxProps> = (props) => {
	return <RcCheckBox {...props} prefixCls="up-checkbox" />
}

export default CheckBox
