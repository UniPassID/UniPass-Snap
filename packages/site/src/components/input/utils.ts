import type { FieldErrors } from 'react-hook-form'
import { get } from 'react-hook-form'

export const handleErrors = (errors?: FieldErrors, name?: string) => {
	console.log('handleErrors: ', errors, name)
	if (!errors || !name) return { message: '', hasError: false }
	if (!Reflect.ownKeys(errors).length) return { message: '', hasError: false }
	

	// const errorType = errors?.[name]?.type
	const errorType = get(errors, name)
	console.log('errorType: ', errorType)
	if (!errorType) return { message: '', hasError: false }

	let message = errors?.[name]?.message as string

	if (message && typeof message === 'string') return { message, hasError: true }

	switch (errorType) {
		case 'required':
			message = `${name} is required`
			break
		case 'pattern':
			message = `${name} is mismatch with pattern`
			break
		default:
			message = `${name} is not valid`
			break
	}

	return { message, hasError: true }
}
