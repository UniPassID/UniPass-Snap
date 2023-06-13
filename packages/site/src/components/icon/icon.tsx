import React from 'react'
import clsx from 'clsx'

interface IconProps {
	src: string
	width?: number
	height?: number
	name?: string
	size?: 'sm' | 'md' | 'lg'
}

const Icon: React.FC<IconProps> = (props) => {
	const { src, name, width, height, size } = props

	const classes = clsx('up_icon', {
		[`up_icon_${size}`]: size
	})

	return <img className={classes} src={src} alt={name} width={width} height={height} />
}

export default Icon
