import React from 'react'
import clsx from 'clsx'

interface IconProps {
	src: string
	width?: number
	height?: number
	name?: string
	style?: React.CSSProperties
	size?: 'sm' | 'md' | 'lg'
}

const Icon: React.FC<IconProps> = (props) => {
	const { src, name, width, height, size, style } = props

	const classes = clsx('up_icon', {
		[`up_icon_${size}`]: size
	})

	return <img style={style} className={classes} src={src} alt={name} width={width} height={height} />
}

export default Icon
