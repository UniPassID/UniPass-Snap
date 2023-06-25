import { ApiResponse, SignInput, SignOutPut } from '@/types/requst'
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
    url: '/snap-server/api/v1/account/login',
    baseURL: 'https://d.wallet.unipass.vip',
    data: {
      ...data,
      loginMessage,
      loginSignature
    }
  })
}
