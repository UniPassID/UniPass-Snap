import { ApiResponse, AuthorizeTxFeesInput, AuthorizeTxFeesOutput, GetFreeQuotaOutput, SignInput, SignOutPut, SingleTransactionFeesOutput } from '@/types/requst'
import { getSignSig } from '@/utils/snap'
import axios, { AxiosRequestConfig } from 'axios'

const request = async <T>(requestConfig: AxiosRequestConfig): Promise<T> => {
	const { data } = await axios<ApiResponse<T>>(requestConfig)
	return data.data
}

export async function sign(data: SignInput) {
  const { loginMessage, loginSignature } = await getSignSig(data.accountAddress)
	return request<SignOutPut>({
    method: 'POST',
    url: '/api/v1/account/login',
    baseURL: process.env.REACT_APP_API_PREFIX,
    data: {
      ...data,
      loginMessage,
      loginSignature
    }
  })
}

export async function getFreeQuota() {
  const accessToken = localStorage.getItem('up__accessToken')
  return request<GetFreeQuotaOutput>({
    method: 'GET',
    url: '/api/v1/account/get-free-quota',
    baseURL: process.env.REACT_APP_API_PREFIX,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
}

export async function getSingleTransactionFees() {
  const accessToken = localStorage.getItem('up__accessToken')
  return request<SingleTransactionFeesOutput>({
    method: 'GET',
    url: '/api/v1/transaction/get-single-transaction-fee',
    baseURL: process.env.REACT_APP_API_PREFIX,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
}

export async function authorizeTransactionFees(data: AuthorizeTxFeesInput) {
  const accessToken = localStorage.getItem('up__accessToken')
  return request<AuthorizeTxFeesOutput>({
    method: 'POST',
    url: '/api/v1/transaction/authorize-transaction-fees',
    baseURL: process.env.REACT_APP_API_PREFIX,
    data: data,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
}
