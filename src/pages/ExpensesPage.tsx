import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingDown } from 'lucide-react'
import { useProductStore, useExpenseStore } from '@/store'
import {
  Card,
  Button,
  Input,
  Modal,
  Select,
  Textarea,
  Badge,
  EmptyExpenses,
  useToast,
} from '@/shared/ui'
import { formatCurrency, formatDate, getTodayISO } from '@/shared/utils/helpers'
import { EXPENSE_TYPES } from '@/shared/constants'
import type { ExpenseFormData, Expense, ExpenseType } from '@/shared/types'

// Expense Form Component
interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void
  onCancel: () => void
}

function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const { t } = useTranslation()
  const { products } = useProductStore()
  const [formData, setFormData] = useState<ExpenseFormData>({
    productId: '',
    quantity: 1,
    salePrice: 0,
    expenseType: 'sale',
    client: '',
    date: getTodayISO(),
    comment: '',
  })
  const [error, setError] = useState('')

  const selectedProduct = products.find(p => p.id === formData.productId)
  const estimatedProfit = formData.expenseType === 'sale' && selectedProduct && formData.salePrice
    ? (formData.salePrice - selectedProduct.averageCost) * formData.quantity
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.productId || formData.quantity <= 0) return

    if (selectedProduct && formData.quantity > selectedProduct.currentStock) {
      setError(t('validation.insufficientStock'))
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label={t('expenses.selectProduct')}
        value={formData.productId}
        onChange={e => setFormData(prev => ({ ...prev, productId: e.target.value }))}
        options={products.map(p => ({
          value: p.id,
          label: `${p.name} (${t('products.currentStock')}: ${p.currentStock})`,
        }))}
        placeholder={t('expenses.selectProduct')}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('expenses.quantity')}
          type="number"
          value={formData.quantity}
          onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
          min={1}
          max={selectedProduct?.currentStock}
          required
          error={error}
        />
        <Select
          label={t('expenses.expenseType')}
          value={formData.expenseType}
          onChange={e => setFormData(prev => ({ ...prev, expenseType: e.target.value as ExpenseType }))}
          options={EXPENSE_TYPES.map(type => ({ value: type.value, label: t(type.labelKey) }))}
        />
      </div>

      {formData.expenseType === 'sale' && (
        <>
          <Input
            label={t('expenses.salePrice')}
            type="number"
            value={formData.salePrice || ''}
            onChange={e => setFormData(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
            min={0}
            step="0.01"
          />

          {/* Profit Display */}
          {selectedProduct && (formData.salePrice ?? 0) > 0 && (
            <div className={`p-4 rounded-ios-lg ${estimatedProfit >= 0 ? 'bg-ios-green/5 dark:bg-ios-green/10' : 'bg-ios-red/5 dark:bg-ios-red/10'}`}>
              <div className="flex items-center justify-between">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  {t('expenses.profit')}
                </span>
                <span className={`text-xl font-bold ${estimatedProfit >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                  {estimatedProfit >= 0 ? '+' : ''}{formatCurrency(estimatedProfit)}
                </span>
              </div>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                {t('products.avgCost')}: {formatCurrency(selectedProduct.averageCost)}
              </p>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('expenses.client')}
          value={formData.client || ''}
          onChange={e => setFormData(prev => ({ ...prev, client: e.target.value }))}
          placeholder={t('expenses.client')}
        />
        <Input
          label={t('expenses.date')}
          type="date"
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <Textarea
        label={t('expenses.comment')}
        value={formData.comment || ''}
        onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
        placeholder={t('expenses.comment')}
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          {t('common.cancel')}
        </Button>
        <Button type="submit" fullWidth disabled={!formData.productId || formData.quantity <= 0}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  )
}

// Expense Card Component
interface ExpenseCardProps {
  expense: Expense
}

function ExpenseCard({ expense }: ExpenseCardProps) {
  const { t } = useTranslation()

  const getExpenseTypeColor = (type: ExpenseType) => {
    switch (type) {
      case 'sale': return 'success'
      case 'damage': return 'danger'
      case 'personal': return 'warning'
      case 'return': return 'info'
      default: return 'default'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card hover>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-ios-lg bg-ios-red/10 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6 text-ios-red" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-light-text dark:text-dark-text truncate">
                  {expense.productName}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {expense.quantity} x {formatCurrency(expense.unitCost)}
                </p>
              </div>
              <div className="text-right">
                {expense.expenseType === 'sale' && expense.salePrice && (
                  <p className="font-bold text-ios-green">
                    +{formatCurrency(expense.quantity * expense.salePrice)}
                  </p>
                )}
                {expense.profit !== undefined && (
                  <p className={`text-sm ${expense.profit >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                    {t('expenses.profit')}: {expense.profit >= 0 ? '+' : ''}{formatCurrency(expense.profit)}
                  </p>
                )}
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {formatDate(expense.date)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={getExpenseTypeColor(expense.expenseType)} size="sm">
                {t(`expenses.types.${expense.expenseType}`)}
              </Badge>
              {expense.client && (
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {expense.client}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function ExpensesPage() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { expenses, addExpense, getTotalRevenue, getTotalProfit } = useExpenseStore()

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ExpenseType | ''>('')

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesSearch =
          expense.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (expense.client?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        const matchesType = !typeFilter || expense.expenseType === typeFilter
        return matchesSearch && matchesType
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [expenses, searchQuery, typeFilter])

  const totalRevenue = getTotalRevenue()
  const totalProfit = getTotalProfit()

  // Handle form submission
  const handleSubmit = (data: ExpenseFormData) => {
    try {
      addExpense(data)
      addToast(t('notifications.expenseAdded'), 'success')
      setShowForm(false)
    } catch (error: any) {
      addToast(error.message || t('notifications.operationFailed'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('expenses.title')}
          </h1>
          <div className="flex gap-4 text-sm">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {t('dashboard.totalRevenue')}: <span className="text-ios-green font-semibold">{formatCurrency(totalRevenue)}</span>
            </span>
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {t('dashboard.profit')}: <span className={`font-semibold ${totalProfit >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>{formatCurrency(totalProfit)}</span>
            </span>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
          {t('expenses.addExpense')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            variant="search"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
        <Select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as ExpenseType | '')}
          options={[
            { value: '', label: t('common.all') },
            ...EXPENSE_TYPES.map(type => ({ value: type.value, label: t(type.labelKey) })),
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <EmptyExpenses onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredExpenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={t('expenses.addExpense')}
        size="lg"
      >
        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}
