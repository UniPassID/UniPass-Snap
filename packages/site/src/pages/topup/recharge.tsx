import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import styles from './topup.module.scss'
import { Button, Input } from '@/components'
import { metamaskAccountTokenListState, smartAccountState } from '@/store'
import { useRecoilValue } from 'recoil'
import { weiToEther } from '@/utils'
import { TokenInfo } from '@/types'

export const ReCharge: React.FC<{
	checkedAssets?: string
	metamaskAccount?: string
	recharge: (amount: string, token: TokenInfo) => Promise<void>
}> = ({ checkedAssets, metamaskAccount, recharge }) => {
	const tokens = useRecoilValue(metamaskAccountTokenListState)
	const smartAccount = useRecoilValue(smartAccountState)

	const methods = useForm({
		mode: 'onChange'
	})
	const { handleSubmit } = methods
	console.log(methods.formState.errors)

	const selectedToken = useMemo(() => {
		const token = tokens.find((token) => checkedAssets === token.contractAddress)
		methods.resetField('Amount')
		return token
	}, [tokens, checkedAssets])

	const onSubmit = (data: any) => {
		console.log(data)
		if (selectedToken) recharge(data.Amount, selectedToken)
	}

	return (
		<>
			<div className={styles.amount}>
				<div className={styles.title}>Top Up</div>
				<form>
					<Input
						type="number"
						placeholder="Amount"
						name="Amount"
						formField={methods}
						validateShame={{
							max: {
								value: selectedToken ? parseFloat(weiToEther(selectedToken.balance || 0, selectedToken.decimals)) : 0,
								message: 'Insufficient Funds'
							},
							required: true
						}}
					/>
				</form>

				{selectedToken ? (
					<div className={styles.selected_token}>
						<div className={styles.title}>Token</div>
						<div className={styles.title}>{selectedToken.symbol}</div>
						<div className={styles.title}>{selectedToken.chainId}</div>
					</div>
				) : (
					<div className={styles.selected_token}></div>
				)}

				<div className={styles.transfer_info}>
					<div className={styles.item}>
						<div className={styles.title}>FROM METAMASK ADDRESS</div>
						<div className={styles.address}>{metamaskAccount}</div>
					</div>
					<div className={styles.item}>
						<div className={styles.title}>TO SNAP ADDRESS</div>
						<div className={styles.address}>{smartAccount}</div>
					</div>
				</div>
			</div>
			<div className={styles.topup_btn}>
				<Button size="md" btnType="filled" type="submit" onClick={handleSubmit(onSubmit)}>
					Top Up
				</Button>
			</div>
		</>
	)
}
