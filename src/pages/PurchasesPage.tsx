import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShoppingCart } from 'lucide-react'
import { useProductStore, usePurchaseStore } from '@/store'
import {
  Card,
  Button,
  Input,
  Modal,
  Select,
  Textarea,
  EmptyPurchases,
  useToast,
} from '@/shared/ui'
import { formatCurrency, formatDate, getTodayISO } from '@/shared/utils/helpers'
import type { PurchaseFormData, Purchase } from '@/shared/types'

// Purchase Form Component
interface PurchaseFormProps {
  onSubmit: (data: PurchaseFormData) => void
  onCancel: () => void
}

function PurchaseForm({ onSubmit, onCancel }: PurchaseFormProps) {
  const { t } = useTranslation()
  const { products } = useProductStore()
  const [formData, setFormData] = useState<PurchaseFormData>({
    productId: '',
    quantity: 1,
    unitCost: 0,
    supplier: '',
    date: getTodayISO(),
    comment: '',
  })

  const totalCost = formData.quantity * formData.unitCost

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.productId || formData.quantity <= 0 || formData.unitCost <= 0) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label={t('purchases.selectProduct')}
        value={formData.productId}
        onChange={e => setFormData(prev => ({ ...prev, productId: e.target.value }))}
        options={products.map(p => ({ value: p.id, label: `${p.name} (${p.code})` }))}
        placeholder={t('purchases.selectProduct')}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('purchases.quantity')}
          type="number"
          value={formData.quantity}
          onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
          min={1}
          required
        />
        <Input
          label={t('purchases.unitCost')}
          type="number"
          value={formData.unitCost}
          onChange={e => setFormData(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
          min={0}
          step="0.01"
          required
        />
      </div>

      {/* Total Cost Display */}
      <div className="p-4 bg-ios-blue/5 dark:bg-ios-blue/10 rounded-ios-lg">
        <div className="flex items-center justify-between">
          <span className="text-light-text-secondary dark:text-dark-text-secondary">
            {t('purchases.totalCost')}
          </span>
          <span className="text-xl font-bold text-ios-blue">
            {formatCurrency(totalCost)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('purchases.supplier')}
          value={formData.supplier || ''}
          onChange={e => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
          placeholder={t('purchases.supplier')}
        />
        <Input
          label={t('purchases.date')}
          type="date"
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <Textarea
        label={t('purchases.comment')}
        value={formData.comment || ''}
        onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
        placeholder={t('purchases.comment')}
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          {t('common.cancel')}
        </Button>
        <Button type="submit" fullWidth disabled={!formData.productId || formData.quantity <= 0 || formData.unitCost <= 0}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  )
}

// Purchase Card Component
interface PurchaseCardProps {
  purchase: Purchase
}

function PurchaseCard({ purchase }: PurchaseCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card hover>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-ios-lg bg-ios-green/10 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6 text-ios-green" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-light-text dark:text-dark-text truncate">
                  {purchase.productName}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {purchase.quantity} x {formatCurrency(purchase.unitCost)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-ios-green">
                  {formatCurrency(purchase.totalCost)}
                </p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  {formatDate(purchase.date)}
                </p>
              </div>
            </div>
            {(purchase.supplier || purchase.comment) && (
              <div className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {purchase.supplier && <span>{t('purchases.supplier')}: {purchase.supplier}</span>}
                {purchase.comment && <p className="truncate">{purchase.comment}</p>}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function PurchasesPage() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { products } = useProductStore()
  const { purchases, addPurchase, getTotalPurchases } = usePurchaseStore()

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [productFilter, setProductFilter] = useState('')

  // Filter purchases
  const filteredPurchases = useMemo(() => {
    return purchases
      .filter(purchase => {
        const matchesSearch =
          purchase.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (purchase.supplier?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
        const matchesProduct = !productFilter || purchase.productId === productFilter
        return matchesSearch && matchesProduct
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [purchases, searchQuery, productFilter])

  const totalPurchases = getTotalPurchases()

  // Handle form submission
  const handleSubmit = (data: PurchaseFormData) => {
    try {
      addPurchase(data)
      addToast(t('notifications.purchaseAdded'), 'success')
      setShowForm(false)
    } catch (error) {
      addToast(t('notifications.operationFailed'), 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('purchases.title')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {t('purchases.totalCost')}: {formatCurrency(totalPurchases)}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
          {t('purchases.addPurchase')}
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
          value={productFilter}
          onChange={e => setProductFilter(e.target.value)}
          options={[
            { value: '', label: t('common.all') },
            ...products.map(p => ({ value: p.id, label: p.name })),
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <EmptyPurchases onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredPurchases.map(purchase => (
              <PurchaseCard key={purchase.id} purchase={purchase} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={t('purchases.addPurchase')}
        size="lg"
      >
        <PurchaseForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}
