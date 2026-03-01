import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Package, Edit2, Trash2 } from 'lucide-react'
import { useProductStore } from '@/store'
import {
  Card,
  Button,
  Input,
  Modal,
  Select,
  ConfirmModal,
  Badge,
  EmptyProducts,
  useToast,
} from '@/shared/ui'
import { formatCurrency, formatNumber, getStockStatus } from '@/shared/utils/helpers'
import { UNITS } from '@/shared/constants'
import type { Product, ProductFormData } from '@/shared/types'

// Product Form Component
interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
}

function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const { t } = useTranslation()
  const { categories } = useProductStore()
  const [formData, setFormData] = useState<ProductFormData>({
    code: product?.code || '',
    name: product?.name || '',
    unit: product?.unit || 'pcs',
    barcode: product?.barcode || '',
    category: product?.category || categories[0]?.name || '',
    minStock: product?.minStock || 10,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('products.productCode')}
          value={formData.code}
          onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
          placeholder="SKU-001"
          required
        />
        <Input
          label={t('products.productName')}
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder={t('products.productName')}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label={t('products.unit')}
          value={formData.unit}
          onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value as Product['unit'] }))}
          options={UNITS.map(u => ({ value: u.value, label: t(u.labelKey) }))}
        />
        <Select
          label={t('products.category')}
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          options={categories.map(c => ({ value: c.name, label: c.name }))}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('products.barcode')}
          value={formData.barcode || ''}
          onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
          placeholder="123456789012"
        />
        <Input
          label={t('products.minStock')}
          type="number"
          value={formData.minStock}
          onChange={e => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
          min={0}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
          {t('common.cancel')}
        </Button>
        <Button type="submit" fullWidth>
          {t('common.save')}
        </Button>
      </div>
    </form>
  )
}

// Product Card Component
interface ProductCardProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
}

function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useTranslation()
  const stockStatus = getStockStatus(product)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start gap-4">
          {/* Product Icon */}
          <div className="w-16 h-16 rounded-ios-lg bg-light-separator dark:bg-dark-separator flex items-center justify-center shrink-0">
            <Package className="w-8 h-8 text-light-text-secondary dark:text-dark-text-secondary" />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-light-text dark:text-dark-text truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {product.code}
                </p>
              </div>
              <Badge
                variant={stockStatus === 'low' ? 'danger' : stockStatus === 'medium' ? 'warning' : 'success'}
                size="sm"
              >
                {t(`products.stockStatus.${stockStatus}`)}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  {t('products.currentStock')}:
                </span>
                <span className="ml-1 font-medium text-light-text dark:text-dark-text">
                  {formatNumber(product.currentStock)} {t(`products.units.${product.unit}`)}
                </span>
              </div>
              <div>
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  {t('products.avgCost')}:
                </span>
                <span className="ml-1 font-medium text-light-text dark:text-dark-text">
                  {formatCurrency(product.averageCost)}
                </span>
              </div>
              <div>
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  {t('products.category')}:
                </span>
                <span className="ml-1 font-medium text-light-text dark:text-dark-text">
                  {product.category}
                </span>
              </div>
              <div>
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  {t('products.totalValue')}:
                </span>
                <span className="ml-1 font-medium text-light-text dark:text-dark-text">
                  {formatCurrency(product.currentStock * product.averageCost)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={onEdit} leftIcon={<Edit2 className="w-4 h-4" />}>
                {t('common.edit')}
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-ios-red hover:bg-ios-red/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function ProductsPage() {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProductStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !categoryFilter || product.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  // Handle form submission
  const handleSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data)
      addToast(t('notifications.productUpdated'), 'success')
    } else {
      addProduct(data)
      addToast(t('notifications.productAdded'), 'success')
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  // Handle delete
  const handleDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id)
      addToast(t('notifications.productDeleted'), 'success')
      setDeletingProduct(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('products.title')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {products.length} {t('dashboard.products')}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
          {t('products.addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            variant="search"
            placeholder={t('products.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          options={[
            { value: '', label: t('common.all') },
            ...categories.map(c => ({ value: c.name, label: c.name })),
          ]}
          className="w-full sm:w-48"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyProducts onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => {
                  setEditingProduct(product)
                  setShowForm(true)
                }}
                onDelete={() => setDeletingProduct(product)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
        title={editingProduct ? t('products.editProduct') : t('products.addProduct')}
        size="lg"
      >
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title={t('common.confirm')}
        message={t('products.deleteConfirm')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
      />
    </div>
  )
}
