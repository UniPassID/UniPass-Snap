import {
	ApiResponse,
	AuthorizeTxFeesInput,
	AuthorizeTxFeesOutput,
	GetFreeQuotaOutput,
	SignInput,
	SignOutPut,
	SingleTransactionFeesOutput,
	VerifyTxFeesOutput
} from '@/types/request'
import { getAuthentication } from '@/utils/snap'
import axios, { AxiosRequestConfig } from 'axios'

const BASE_URL = process.env.REACT_APP_SNAP_SERVER_PREFIX

const request = async <T>(requestConfig: AxiosRequestConfig): Promise<T> => {
	const { data } = await axios<ApiResponse<T>>(requestConfig)
	return data.data
}

export async function sign(data: SignInput) {
	const { loginMessage, loginSignature } = await getAuthentication(data.accountAddress)
	return request<SignOutPut>({
		method: 'POST',
		url: '/api/v1/account/login',
		baseURL: BASE_URL,
		data: {
			...data,
			loginMessage,
			loginSignature
		}
	})
}

export async function getFreeQuota() {
	const accessToken = sessionStorage.getItem('up__accessToken')
	return request<GetFreeQuotaOutput>({
		method: 'GET',
		url: '/api/v1/account/get-free-quota',
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
}

export async function getSingleTransactionFees() {
	const accessToken = sessionStorage.getItem('up__accessToken')
	return request<SingleTransactionFeesOutput>({
		method: 'GET',
		url: '/api/v1/transaction/get-single-transaction-fee',
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
}

export async function authorizeTransactionFees(data: AuthorizeTxFeesInput) {
	const accessToken = sessionStorage.getItem('up__accessToken')
	return request<AuthorizeTxFeesOutput>({
		method: 'POST',
		url: '/api/v1/transaction/authorize-transaction-fees',
		baseURL: BASE_URL,
		data: data,
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
}

export async function verifyTransactionFees(data: AuthorizeTxFeesInput) {
	const accessToken = sessionStorage.getItem('up__accessToken')
	return request<VerifyTxFeesOutput>({
		method: 'POST',
		url: '/api/v1/transaction/verify-transaction-fees',
		baseURL: BASE_URL,
		data: data,
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	})
}
