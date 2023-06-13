import React from 'react'

export const getCloseIcon = (hasError: boolean) => {
	let color = ''
	if (hasError) {
		color = '#e85050'
	} else {
		color = 'var(--up-text-secondary)'
	}
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
				stroke={color}
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
			<path
				d="M12.3572 7.64307L7.64319 12.3571"
				stroke={color}
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.64319 7.64307L12.3572 12.3571"
				stroke={color}
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export const getEyeInVisibleIcon = (hasError: boolean) => {
	let color = ''
	if (hasError) {
		color = '#e85050'
	} else {
		color = 'var(--up-text-secondary)'
	}
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.63604 7C2.00736 8.5 1 10 1 10C1 10 5.02943 16 10 16C10.6165 16 11.2184 15.9077 11.8 15.746M8.21431 4.25C8.79148 4.0908 9.38863 4 10 4C14.9706 4 19 10 19 10C19 10 17.9926 11.5 16.3639 13"
				stroke={color}
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M17.5 17.5L2.5 2.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M12.35 10C12.35 10.359 12.641 10.65 13 10.65C13.359 10.65 13.65 10.359 13.65 10H12.35ZM10 6.35C9.64101 6.35 9.35 6.64101 9.35 7C9.35 7.35899 9.64101 7.65 10 7.65V6.35ZM13.65 10C13.65 7.98417 12.0158 6.35 10 6.35V7.65C11.2979 7.65 12.35 8.70214 12.35 10H13.65ZM6.35 10C6.35 12.0158 7.98417 13.65 10 13.65V12.35C8.70214 12.35 7.65 11.2979 7.65 10H6.35ZM7.37806 7.46073C6.74232 8.11706 6.35 9.01338 6.35 10H7.65C7.65 9.36438 7.9015 8.78883 8.31183 8.36521L7.37806 7.46073ZM10 13.65C10.9866 13.65 11.8829 13.2577 12.5393 12.6219L11.6348 11.6882C11.2112 12.0985 10.6356 12.35 10 12.35V13.65Z"
				fill={color}
			/>
		</svg>
	)
}

export const getEyeVisibleIcon = (hasError: boolean) => {
	let color = ''
	if (hasError) {
		color = '#e85050'
	} else {
		color = 'var(--up-text-secondary)'
	}
	return (
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10 16C14.9706 16 19 10 19 10C19 10 14.9706 4 10 4C5.02943 4 1 10 1 10C1 10 5.02943 16 10 16Z"
				stroke={color}
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
			<path
				d="M10 13C11.6568 13 13 11.6568 13 10C13 8.34316 11.6568 7 10 7C8.34316 7 7 8.34316 7 10C7 11.6568 8.34316 13 10 13Z"
				stroke={color}
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export const error_message_icon = (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M5.99995 4.93937L1.78602 0.725436L1.78622 0.72524L1.77839 0.718196C1.62949 0.584192 1.45311 0.51131 1.25573 0.51131C1.05443 0.51131 0.877937 0.590219 0.734078 0.734078C0.590219 0.877937 0.51131 1.05443 0.51131 1.25573C0.51131 1.45311 0.584192 1.62949 0.718196 1.77839L0.71799 1.77857L0.725436 1.78602L4.93937 5.99995L0.725436 10.2139C0.525405 10.4139 0.457228 10.6648 0.525923 10.9396C0.558899 11.0715 0.618585 11.1893 0.710891 11.2837C0.803427 11.3783 0.919502 11.44 1.05037 11.4737C1.32238 11.5436 1.57292 11.4725 1.78069 11.2796L1.78079 11.2797L1.78602 11.2745L5.99995 7.06054L10.2139 11.2745L10.2137 11.2747L10.2215 11.2817C10.3704 11.4157 10.5468 11.4886 10.7442 11.4886C10.9455 11.4886 11.122 11.4097 11.2658 11.2658C11.4097 11.122 11.4886 10.9455 11.4886 10.7442C11.4886 10.5468 11.4157 10.3704 11.2817 10.2215L11.2819 10.2213L11.2745 10.2139L7.06054 5.99995L11.2745 1.78602C11.4745 1.58599 11.5427 1.33509 11.474 1.06031L11.28 1.10882L11.474 1.06031C11.4407 0.927371 11.3797 0.809075 11.2853 0.714634C11.1908 0.620193 11.0725 0.559158 10.9396 0.525923C10.6648 0.457228 10.4139 0.525405 10.2139 0.725436L5.99995 4.93937Z"
			fill="#E85050"
			stroke="#E85050"
			strokeWidth="0.4"
		/>
	</svg>
)

export const counter_decrease_icon = (
	<svg width="16" height="2" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M15 1H1" stroke="var(--up-divider-line)" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
)

export const counter_increase_icon = (
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 8H15" stroke="var(--up-divider-line)" strokeWidth="1.5" strokeLinecap="round" />
		<path d="M8 1V15" stroke="var(--up-divider-line)" strokeWidth="1.5" strokeLinecap="round" />
	</svg>
)
