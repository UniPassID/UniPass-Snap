export interface ApiResponse<T> {
	statusCode: number
	message?: string
	error?: string
	data: T
}

export interface SignOutPut {
  guideStatus: number
  accessToken: string
  isNewAccount: boolean
}

export interface SignInput {
	accountAddress: string
	providerIdentifier: string
	providerType?: string
}
