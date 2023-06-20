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
		return parsedTxs.filter(tx => tx.status === status)
	} catch (e) {
		console.error('[history getHistoryByStatus]', e)
	}
  return []
}

export function updateHistory(address: string, chainId: number, hash: string, status: TransactionStatus, error?: string) {
	try {
		const historyKey = `${address}_his`
		const allTxs = localStorage.getItem(historyKey) || '[]'
		const parsedTxs = JSON.parse(allTxs) as TransactionRecord[]
		parsedTxs.forEach((tx) => {
			if (tx.chainId === chainId && tx.hash === hash) {
				tx.status = status
        tx.error = error
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
		return JSON.parse(allTxs) as TransactionRecord[]
	} catch (e) {
		console.error('[history updateHistory]', e)
	}
  return []
}
