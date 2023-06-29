import { TransactionRecord, TransactionStatus } from '@/types/transaction'

export function addHistory(address: string, txRecord: TransactionRecord) {
	try {
		const historyKey = `${address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		parsedTxs.push(txRecord)
		localStorage.setItem(historyKey, JSON.stringify(parsedTxs))
	} catch (e) {
		console.error('[history addHistory]', e)
	}
}

export function getHistoryByStatus(address: string, status: TransactionStatus): TransactionRecord[] {
	try {
		const historyKey = `${address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		return parsedTxs.filter((tx) => tx.status === status)
	} catch (e) {
		console.error('[history getHistoryByStatus]', e)
	}
	return []
}

export function getHistoryByStatusAndChain(address: string, status: TransactionStatus, chainId: number) {
	try {
		const historyKey = `${address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		return parsedTxs.filter((tx) => tx.status === status && tx.chainId === chainId)
	} catch (e) {
		console.error('[history getHistoryByStatus]', e)
	}
	return []
}

export function updateHistory(record: {
	address: string
	chainId: number
	relayerHash: string
	status: TransactionStatus
	error?: string
	hash?: string
}) {
	try {
		const historyKey = `${record.address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		parsedTxs.forEach((tx) => {
			if (tx.chainId === record.chainId && tx.relayerHash === record.relayerHash) {
				tx.status = record.status
				tx.error = record.error
				tx.hash = record.hash
			}
		})
		localStorage.setItem(historyKey, JSON.stringify(parsedTxs))
	} catch (e) {
		console.error('[history updateHistory]', e)
	}
}

export function getHistory(address: string): TransactionRecord[] {
	try {
		const historyKey = `${address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		return parsedTxs.sort((pre, next) => next.timestamp - pre.timestamp)
	} catch (e) {
		console.error('[history getHistory]', e)
	}
	return []
}
