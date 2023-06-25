import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { metamaskAccountTokenListState, smartAccountState } from '@/store'
import Input from './topup-input'
import { Button, Icon, TokenIcon } from '@/components'
import { weiToEther } from '@/utils'
import { getChainNameByChainId } from '@/constants'
import { TokenInfo } from '@/types'
import MetaMask from '@/assets/svg/MetaMask.svg'
import UniPass from '@/assets/svg/UniPass_Icon.svg'
import styles from './topup.module.scss'

export const ReCharge: React.FC<{
	checkedAssets?: string
	metamaskAccount?: string
	recharge: (amount: string, token: TokenInfo) => Promise<void>
	rechargeLoading: boolean
}> = ({ checkedAssets, metamaskAccount, recharge, rechargeLoading }) => {
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
						<div className={styles.title}>TOKEN</div>
						<div className={styles.token_info}>
							<div className={styles.info}>
								<TokenIcon type={selectedToken.symbol} width={28} height={28} />
								{selectedToken.symbol}
							</div>
							<div className={styles.info}>
								<TokenIcon type={getChainNameByChainId(selectedToken.chainId)} width={16} height={16} />
								{getChainNameByChainId(selectedToken.chainId)}
							</div>
						</div>
					</div>
				) : (
					<div className={styles.selected_token}></div>
				)}

				<div className={styles.transfer_info}>
					<div className={styles.item}>
						<div className={styles.title}>FROM METAMASK ADDRESS</div>
						<div className={styles.address}>
							<Icon src={MetaMask} width={20} height={20} />
							{metamaskAccount}
						</div>
					</div>
					<div className={styles.item}>
						<div className={styles.title}>TO SNAP ADDRESS</div>
						<div className={styles.address}>
							<Icon src={UniPass} width={20} height={20} />
							{smartAccount}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.topup_btn}>
				<Button size="md" btnType="filled" type="submit" loading={rechargeLoading} onClick={handleSubmit(onSubmit)}>
					Top Up
				</Button>
			</div>
		</>
	)
}
