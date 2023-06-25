import React from 'react'
import clsx from 'clsx'
import USDT from '@/assets/svg/USDT.svg'
import USDC from '@/assets/svg/USDC.svg'
import Polygon from '@/assets/svg/Polygon.svg'
import Arbitrum from '@/assets/svg/Arbitrum.svg'

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

export const TokenIcon: React.FC<Omit<IconProps, 'src'> & { type: string }> = (props) => {
	const { type, ...restProps } = props

	switch (type) {
		case 'USDT':
			return <Icon {...restProps} src={USDT} />
		case 'USDC':
			return <Icon {...restProps} src={USDC} />
		case 'Polygon':
			return <Icon {...restProps} src={Polygon} />
		case 'Arbitrum':
			return <Icon {...restProps} src={Arbitrum} />
		default:
			return null
	}
}

export default Icon
