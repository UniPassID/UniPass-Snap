import { usePay } from '@/hooks/usePay'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import Transfer from './transfer'
import { Button } from '@/components'

const DEFAULT_CHAIN = '80001'
const DEFAULT_SYMBOL = 'USDC'

const Pay: React.FC = () => {
	const [searchParams] = useSearchParams()
	const symbol = searchParams.get('tokenName') || DEFAULT_SYMBOL
	const chainId = searchParams.get('chainId') || DEFAULT_CHAIN
	const { token, setToken, currentChain, setCurrentChain } = usePay(chainId, symbol)

	const { handleSubmit, ...rest } = useForm<any>({
		mode: 'onChange',
		defaultValues: {
			txs: [{ amount: undefined, to: undefined }]
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: rest.control,
		name: 'txs'
	})

	console.log(rest.formState.errors)

	const addMore = () => {
		append({ amount: undefined, to: undefined }, { shouldFocus: true })
	}

	const onSubmit = (data: any) => {
		rest.setError(`txs.${1}.to`, { type: 'custom', message: 'custom message' })
		console.log('data: ', data)
	}

	return (
		<div>
			<div>{token?.symbol}</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{fields.map((item, index) => {
					return <Transfer key={item.id} index={index} remove={remove} formField={rest} />
				})}
				<Button type="submit">Pay</Button>
				<Button type="button" onClick={addMore}>
					Add more
				</Button>
			</form>
		</div>
	)
}

export default Pay
