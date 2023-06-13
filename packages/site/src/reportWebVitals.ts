import type { ReportHandler, Metric } from 'web-vitals'

const sendToGoogleAnalytics = (metric: Metric) => {
	// const { name, delta, id } = metric

	console.log(metric)

	// gtag('event', name, {
	// 	event_category: 'Web Vitals',
	// 	// Google Analytics metrics must be integers, so the value is rounded.
	// 	// For CLS the value is first multiplied by 1000 for greater precision
	// 	// (note: increase the multiplier for greater precision if needed).
	// 	value: Math.round(name === 'CLS' ? delta * 1000 : delta),
	// 	// The `id` value will be unique to the current page load. When sending
	// 	// multiple values from the same page (e.g. for CLS), Google Analytics can
	// 	// compute a total by grouping on this ID (note: requires `eventLabel` to
	// 	// be a dimension in your report).
	// 	event_label: id,
	// 	// Use a non-interaction event to avoid affecting bounce rate.
	// 	non_interaction: true
	// })
}

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
			getCLS(onPerfEntry)
			getFID(onPerfEntry)
			getFCP(onPerfEntry)
			getLCP(onPerfEntry)
			getTTFB(onPerfEntry)
		})
	}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => reportWebVitals(sendToGoogleAnalytics)
