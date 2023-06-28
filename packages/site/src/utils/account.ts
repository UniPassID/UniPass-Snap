import { SignInput } from '@/types/request'
import { sign } from '@/request'

export async function fetchAccessToken(data: SignInput) {
	try {
		const res = await sign(data)
		localStorage.setItem('up__accessToken', res.accessToken)
		return res
	} catch (e) {
		console.error('[fetchAccessToken failed]', e)
		throw e
	}
}
