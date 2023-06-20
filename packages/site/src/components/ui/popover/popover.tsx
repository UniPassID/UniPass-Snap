import React from 'react'
import RcTooltip from 'rc-tooltip'
import type { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip'

const Popover: React.FC<RcTooltipProps> = (props) => {
	const { showArrow = true, onPopupAlign, ...rest } = props

	return (
		<RcTooltip
			{...rest}
			showArrow={showArrow}
			motion={{
				motionName: 'up-popover-animation',
				motionDeadline: 100
			}}
			prefixCls="up-popover"
		/>
	)
}

export default Popover
