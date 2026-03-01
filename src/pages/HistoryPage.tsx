import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ShoppingCart, TrendingDown } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useProductStore, usePurchaseStore, useExpenseStore } from '@/store'
import { Card, Button, Input, Select, Badge, EmptyTransactions, TabButtonGroup } from '@/shared/ui'
import { formatCurrency, formatDate, formatDateTime } from '@/shared/utils/helpers'
import type { Transaction, TransactionType } from '@/shared/types'

// Transaction Row Component
interface TransactionRowProps {
  transaction: Transaction
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const { t } = useTranslation()
  const isPurchase = transaction.type === 'purchase'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="flex items-center gap-4 p-4 bg-light-card dark:bg-dark-card rounded-ios-lg border border-light-border dark:border-dark-border hover:shadow-ios transition-shadow">
        <div className={`w-10 h-10 rounded-ios flex items-center justify-center shrink-0 ${
          isPurchase ? 'bg-ios-green/10' : 'bg-ios-red/10'
        }`}>
          {isPurchase ? (
            <ShoppingCart className="w-5 h-5 text-ios-green" />
          ) : (
            <TrendingDown className="w-5 h-5 text-ios-red" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-light-text dark:text-dark-text truncate">
              {transaction.productName}
            </h4>
            <Badge
              variant={isPurchase ? 'success' : 'danger'}
              size="sm"
            >
              {t(`history.transactionTypes.${transaction.type}`)}
            </Badge>
          </div>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {transaction.quantity} x {formatCurrency(transaction.unitCost)}
          </p>
        </div>

        <div className="text-right">
          <p className={`font-semibold ${isPurchase ? 'text-ios-red' : 'text-ios-green'}`}>
            {isPurchase ? '-' : '+'}{formatCurrency(transaction.totalAmount)}
          </p>
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {formatDateTime(transaction.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function HistoryPage() {
  const { t } = useTranslation()
  const { products } = useProductStore()
  const { purchases } = usePurchaseStore()
  const { expenses } = useExpenseStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [productFilter, setProductFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Combine and transform transactions
  const allTransactions = useMemo((): Transaction[] => {
    const purchaseTransactions: Transaction[] = purchases.map(p => ({
      id: p.id,
      type: 'purchase' as const,
      productId: p.productId,
      productName: p.productName,
      quantity: p.quantity,
      unitCost: p.unitCost,
      totalAmount: p.totalCost,
      date: p.date,
      details: p,
      createdAt: p.createdAt,
    }))

    const expenseTransactions: Transaction[] = expenses.map(e => ({
      id: e.id,
      type: 'expense' as const,
      productId: e.productId,
      productName: e.productName,
      quantity: e.quantity,
      unitCost: e.unitCost,
      totalAmount: e.salePrice ? e.quantity * e.salePrice : e.quantity * e.unitCost,
      date: e.date,
      details: e,
      createdAt: e.createdAt,
    }))

    return [...purchaseTransactions, ...expenseTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [purchases, expenses])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      // Search filter
      const matchesSearch = transaction.productName.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter

      // Product filter
      const matchesProduct = !productFilter || transaction.productId === productFilter

      // Date filter
      const transactionDate = new Date(transaction.date)
      const matchesDateFrom = !dateFrom || transactionDate >= new Date(dateFrom)
      const matchesDateTo = !dateTo || transactionDate <= new Date(dateTo)

      return matchesSearch && matchesType && matchesProduct && matchesDateFrom && matchesDateTo
    })
  }, [allTransactions, searchQuery, typeFilter, productFilter, dateFrom, dateTo])

  // Export to Excel
  const handleExport = () => {
    const data = filteredTransactions.map(tx => ({
      [t('purchases.date')]: formatDate(tx.date),
      [t('history.transactionTypes.purchase')]: tx.type === 'purchase' ? t('common.yes') : '',
      [t('history.transactionTypes.expense')]: tx.type === 'expense' ? t('common.yes') : '',
      [t('products.productName')]: tx.productName,
      [t('purchases.quantity')]: tx.quantity,
      [t('purchases.unitCost')]: tx.unitCost,
      [t('purchases.totalCost')]: tx.totalAmount,
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    XLSX.writeFile(wb, `transactions_${formatDate(new Date().toISOString(), 'yyyy-MM-dd')}.xlsx`)
  }

  // Calculate totals
  const totals = useMemo(() => {
    const purchaseTotal = filteredTransactions
      .filter(tx => tx.type === 'purchase')
      .reduce((sum, tx) => sum + tx.totalAmount, 0)

    const expenseTotal = filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.totalAmount, 0)

    return { purchaseTotal, expenseTotal, balance: expenseTotal - purchaseTotal }
  }, [filteredTransactions])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('history.title')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {filteredTransactions.length} {t('history.allTransactions').toLowerCase()}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
          disabled={filteredTransactions.length === 0}
        >
          {t('history.exportExcel')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('history.transactionTypes.purchase')}
            </p>
            <p className="text-2xl font-bold text-ios-red mt-1">
              -{formatCurrency(totals.purchaseTotal)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('history.transactionTypes.expense')}
            </p>
            <p className="text-2xl font-bold text-ios-green mt-1">
              +{formatCurrency(totals.expenseTotal)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {t('dashboard.profit')}
            </p>
            <p className={`text-2xl font-bold mt-1 ${totals.balance >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
              {totals.balance >= 0 ? '+' : ''}{formatCurrency(totals.balance)}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          {/* Type Filter Tabs */}
          <TabButtonGroup
            tabs={[
              { id: 'all', label: t('common.all') },
              { id: 'purchase', label: t('history.transactionTypes.purchase') },
              { id: 'expense', label: t('history.transactionTypes.expense') },
            ]}
            activeTab={typeFilter}
            onChange={(id) => setTypeFilter(id as TransactionType | 'all')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              variant="search"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />
            <Select
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              options={[
                { value: '', label: t('history.filterByProduct') },
                ...products.map(p => ({ value: p.id, label: p.name })),
              ]}
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              placeholder={t('history.filterByDate')}
            />
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              placeholder={t('history.filterByDate')}
            />
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <EmptyTransactions />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map(transaction => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
