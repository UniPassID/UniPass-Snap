import { Input } from '@/components'
import { FieldValues, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form'

const Transfer: React.FC<{
	formField: Omit<UseFormReturn<FieldValues>, 'handleSubmit'>
	key: string
	remove: UseFieldArrayRemove
	index?: number
}> = ({ formField, key, remove, index = 0 }) => {
	return (
		<div key={key}>
			<Input
				type="number"
				placeholder="Input amount"
				formField={formField}
				label="Amount"
				name={`txs.${index}.amount`}
			/>
			<Input
				type="text"
				placeholder="Input recipient address"
				formField={formField}
				label="To"
				name={`txs.${index}.to`}
			/>
			{!!index && <div onClick={() => remove(index)}>delete</div>}
		</div>
	)
}

export default Transfer
