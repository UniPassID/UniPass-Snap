import React from 'react'
import RcTooltip from 'rc-tooltip'
import type { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip'

interface TooltipProps extends Partial<Exclude<RcTooltipProps, 'visible'>> {
	title: string
}

const ToolTip: React.FC<TooltipProps> = (props) => {
	const { title, showArrow = true, ...rest } = props

	return (
		<RcTooltip
			{...rest}
			overlay={title}
			showArrow={showArrow}
			motion={{
				motionName: 'up-tooltip-animation',
				motionDeadline: 100
			}}
			prefixCls="up-tooltip"
		/>
	)
}

export default ToolTip
