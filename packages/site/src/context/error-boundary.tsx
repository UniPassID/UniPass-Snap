import React from 'react'

interface Props {
	children: React.ReactNode
}

interface State {
	hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	// TODO: report global error to sentry
	componentDidCatch(error: Error | null, info: React.ErrorInfo) {
		console.log('ErrorBoundary Error:', error)
		console.log('ErrorBoundary Info:', info)
		this.setState({ hasError: true })
	}

	render() {
		if (this.state.hasError) {
			return (
				<div
					style={{
						height: '100%',
						display: 'flex',
						flexFlow: 'row nowrap',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					Something went wrong, please try again later!
				</div>
			)
		}
		return this.props.children
	}
}
