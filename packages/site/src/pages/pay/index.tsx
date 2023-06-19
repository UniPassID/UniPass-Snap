import { usePay } from '@/hooks/usePay'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import Transfer from './transfer'
import { Button, upNotify } from '@/components'
import { etherToWei, weiToEther } from '@/utils'
import { useCallback, useEffect, useState } from 'react'
import { TokenInfo } from '@/types/token'
import { BigNumber, providers } from 'ethers'
import { useRecoilValue } from 'recoil'
import { smartAccountInsState } from '@/store'
import { makeERC20Contract } from '@/utils/make_contract'
import { getAddress } from 'ethers/lib/utils'
import { SmartAccount } from '@unipasswallet/smart-account'
import { CHAIN_CONFIGS, CUSTOM_AUTH_APPID } from '@/constants'

const DEFAULT_CHAIN = '80001'
const DEFAULT_SYMBOL = 'USDC'

interface GasLimit {
	symbol: string
	token: string
	gasLimit: BigNumber
}

const Pay: React.FC = () => {
	const [searchParams] = useSearchParams()
	const symbol = searchParams.get('tokenName') || DEFAULT_SYMBOL
	const chainId = searchParams.get('chainId') || DEFAULT_CHAIN
	const { token, setToken, availableTokens, SINGLE_GAS } = usePay(chainId, symbol)
	const [totalGas, setTotalGas] = useState<GasLimit[] | undefined>()
	const [showTokens, setShowTokens] = useState<boolean>(false)
	const [selectedGas, setSelectGas] = useState<GasLimit>()
	const smartAccount = useRecoilValue(smartAccountInsState)

	const useFormReturn = useForm<any>({
		mode: 'onChange',
		defaultValues: {
			txs: [{ amount: undefined, to: undefined }]
		}
	})

	const { handleSubmit, getValues, ...rest } = useFormReturn

	const calculateGas = useCallback(() => {
		const values = getValues()
		const txLength = (values.txs?.length || 0) as number
		const totalGas = SINGLE_GAS?.map((gas) => {
			return {
				symbol: gas.symbol,
				token: gas.token,
				gasLimit: gas.gasLimit.mul(txLength)
			}
		})
		setTotalGas(totalGas)
	}, [SINGLE_GAS, getValues])

	useEffect(() => {
		calculateGas()
	}, [calculateGas])

	const { fields, append, remove } = useFieldArray({
		control: rest.control,
		name: 'txs'
	})

	const addMore = () => {
		append({ amount: undefined, to: undefined })
		calculateGas()
	}

	const onSubmit = async (data: any) => {
		// TODO validate
		if (!selectedGas) {
			upNotify.error('You should choose gasOption before pay')
			return
		}
		const contract = makeERC20Contract(getAddress(selectedGas.token))
		// const { encodeTransfer } = useContract(selectedGas.token)
		console.log('selectedPay: ', selectedGas)
		const txs = data.txs
		console.log('txs: ', txs)
		// @ts-ignore
		const provider = new providers.Web3Provider(window.ethereum)
		await provider.send("eth_requestAccounts", [])
		const signer = provider.getSigner()
		const smartAccount = new SmartAccount({
			chainOptions: CHAIN_CONFIGS,
			masterKeySigner: signer,
			appId: CUSTOM_AUTH_APPID
		})
		if (txs.length) {
			const data = contract.interface.encodeFunctionData('transfer', [getAddress(txs[0].to), etherToWei(txs[0].amount)])
			const tx = {
				value: BigNumber.from(0),
				to: getAddress(selectedGas.token),
				data,
			}
			// @ts-ignore
			const res = await smartAccount.sendTransaction(tx, {
				fee: {
					token: selectedGas.token,
					to: getAddress('0x5f747891b5e88df0694b89c959cbd8cb62f48bbd'),
					amount: selectedGas.gasLimit
				}
			})
			// console.log('feeOptions: ', feeOptions)
		}
		
		// smartAccount.simulateTransaction()
	}

	const removeTransfer = (index: number) => {
		remove(index)
		calculateGas()
	}

	const handleSwitchToken = (token: TokenInfo) => {
		setToken(token)
		setShowTokens(false)
	}

	return (
		<div>
			<div onClick={() => setShowTokens(true)}>
				<span>{token?.symbol}</span>
				<span> balance: {weiToEther(token?.balance || 0, token?.decimals)}</span>
			</div>
			{showTokens &&
				availableTokens.map((token) => (
					<div key={token.symbol} onClick={() => handleSwitchToken(token)}>
						<span>
							{token.symbol} balance: {weiToEther(token.balance || 0, token.decimals)}
						</span>
					</div>
				))}
			<form onSubmit={handleSubmit(onSubmit)}>
				{fields.map((item, index) => {
					return (
						<Transfer
							key={item.id}
							id={item.id}
							index={index}
							total={fields.length}
							remove={removeTransfer}
							formField={useFormReturn}
						/>
					)
				})}
				<Button type="submit">Pay</Button>
				<Button type="button" onClick={addMore}>
					Add more
				</Button>
			</form>
			<div>
				totalGas:{' '}
				{token &&
					totalGas?.map((gas) => (
						<div key={gas.token} onClick={() => setSelectGas(gas)}>
							{gas.symbol}: {weiToEther(gas.gasLimit, token.decimals)}
						</div>
					))}
			</div>
		</div>
	)
}

export default Pay
