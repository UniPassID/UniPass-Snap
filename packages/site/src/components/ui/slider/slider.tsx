import React from 'react'
import RcSlider, { SliderProps as RcSliderProps } from 'rc-slider'

interface SliderProps extends RcSliderProps {}

const Slider: React.FC<SliderProps> = (props) => {
	return <RcSlider {...props} prefixCls="up-slider" />
}

export default Slider
