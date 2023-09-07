import ReactGA from 'react-ga4'

type EventName =
	| 'open-snap'
	| 'login-click-install_metamask'
	| 'login-click-connect_snap'
	| 'login-success'
	| 'pre_signup-success'
	| 'topup-click-topup_menu'
	| 'topup-click-topup_payment_page'
	| 'topup-mm-click-get_address'
	| 'topup-mm-click-via_QRcode'
	| 'topup-mm-get_address-success'
	| 'topup-mm-get_balance-success'
	| 'topup-mm-choose-token'
	| 'topup-mm-input-amount'
	| 'topup-mm-click-topup'
	| 'topup-mm-success'
	| 'topup-mm-success-click-go_to_payment'
	| 'topup-mm-success-click-view_in_explorer'
	| 'topup-qrcode-choose-network'
	| 'topup-qrcode-choose-token'
	| 'topup-qrcode-display-qrcode'
	| 'payment-change-payment_token'
	| 'payment-change-gas_token'
	| 'payment-input-amount'
	| 'payment-input-amount-finish'
	| 'payment-input-address'
	| 'payment-input-amount-finish'
	| 'payment-click-add_another_payment'
	| 'payment-click-pay'
	| 'payment-click-payment_menu'
	| 'payment-submitted-success'
	| 'payment-congratulations-popup'
	| 'payment-success'
	| 'homepage-click-scan_button'
	| 'setting-click-disconnect'
	| 'setting-switch-testnet'
	| 'setting-click-FAQ'
	| 'setting-click-document'
	| 'setting-click-support'

type Category = 'homepage' | 'login' | 'signup' | 'topup' | 'payment' | 'setting'

export const upGA = (eventName: EventName, category: Category, data: Record<string, any> = {}) => {
	try {
		const fieldObject = {
			hitType: 'event',
			eventCategory: category,
			eventAction: eventName
		}

		ReactGA.send({ ...fieldObject, ...data })
	} catch (e) {
		console.log('[upGA failed]', e)
	}
}
