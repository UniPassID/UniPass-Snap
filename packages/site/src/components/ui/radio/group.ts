// import classNames from 'classnames'
// import useMergedState from 'rc-util/lib/hooks/useMergedState'
// import * as React from 'react'
// import Radio from './radio'
// import { CheckboxChangeEvent } from 'rc-checkbox'

// export interface RadioGroupProps {
// 	defaultValue?: any
// 	value?: any
// 	onChange?: (e: CheckboxChangeEvent) => void
// 	onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
// 	onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
// 	name?: string
// 	children?: React.ReactNode
// 	id?: string
// 	onFocus?: React.FocusEventHandler<HTMLDivElement>
// 	onBlur?: React.FocusEventHandler<HTMLDivElement>
// 	options: Array<React.ReactNode>
// }

// const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
// 	const [value, setValue] = React.useState(props.defaultValue)

// 	const onRadioChange = (ev: CheckboxChangeEvent) => {
// 		const lastValue = value
// 		const val = ev.target?.value
// 		if (!('value' in props)) {
// 			setValue(val)
// 		}
// 		const { onChange } = props
// 		if (onChange && val !== lastValue) {
// 			onChange(ev)
// 		}
// 	}

// 	const { options, children, id, onMouseEnter, onMouseLeave, onFocus, onBlur } = props
// 	const prefixCls = getPrefixCls('radio', customizePrefixCls)
// 	const groupPrefixCls = `${prefixCls}-group`

// 	// Style
// 	const [wrapSSR, hashId] = useStyle(prefixCls)

// 	let childrenToRender = children
// 	// 如果存在 options, 优先使用
// 	if (options && options.length > 0) {
// 		childrenToRender = options.map((option) => {
// 			if (typeof option === 'string' || typeof option === 'number') {
// 				// 此处类型自动推导为 string
// 				return (
// 					<Radio
// 						key={option.toString()}
// 						prefixCls={prefixCls}
// 						disabled={disabled}
// 						value={option}
// 						checked={value === option}
// 					>
// 						{option}
// 					</Radio>
// 				)
// 			}
// 			// 此处类型自动推导为 { label: string value: string }
// 			return (
// 				<Radio
// 					key={`radio-group-value-options-${option.value}`}
// 					prefixCls={prefixCls}
// 					disabled={option.disabled || disabled}
// 					value={option.value}
// 					checked={value === option.value}
// 					title={option.title}
// 					style={option.style}
// 				>
// 					{option.label}
// 				</Radio>
// 			)
// 		})
// 	}

// 	const mergedSize = useSize(customizeSize)

// 	const classString = classNames(
// 		groupPrefixCls,
// 		`${groupPrefixCls}-${buttonStyle}`,
// 		{
// 			[`${groupPrefixCls}-${mergedSize}`]: mergedSize,
// 			[`${groupPrefixCls}-rtl`]: direction === 'rtl'
// 		},
// 		className,
// 		rootClassName,
// 		hashId
// 	)
// 	return wrapSSR(
// 		<div
// 			{...pickAttrs(props, {
// 				aria: true,
// 				data: true
// 			})}
// 			className={classString}
// 			style={style}
// 			onMouseEnter={onMouseEnter}
// 			onMouseLeave={onMouseLeave}
// 			onFocus={onFocus}
// 			onBlur={onBlur}
// 			id={id}
// 			ref={ref}
// 		>
// 			<RadioGroupContextProvider
// 				value={{
// 					onChange: onRadioChange,
// 					value,
// 					disabled: props.disabled,
// 					name: props.name,
// 					optionType: props.optionType
// 				}}
// 			>
// 				{childrenToRender}
// 			</RadioGroupContextProvider>
// 		</div>
// 	)
// })

// export default React.memo(RadioGroup)
