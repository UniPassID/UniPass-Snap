import { Input } from '@/components'
import { UseFormReturn } from 'react-hook-form'

const Transfer: React.FC<{
	formField: UseFormReturn<any>,
	id: string
	remove: (index: number) => void
  total: number
	index?: number
}> = ({ formField, id, remove,total, index = 0 }) => {
	return (
		<div key={id}>
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
			{(total > 1) && <div onClick={() => remove(index)}>delete</div>}
		</div>
	)
}

export default Transfer
