import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
} from 'lucide-react'
import { useProductStore, usePurchaseStore, useExpenseStore } from '@/store'
import { Card, CardHeader, CardTitle, Badge } from '@/shared/ui'
import { formatCurrency, formatNumber, getStockStatus } from '@/shared/utils/helpers'

// Stat Card Component
interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconBg: string
  change?: { value: number; isPositive: boolean }
  delay?: number
}

function StatCard({ title, value, icon, iconBg, change, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-light-text dark:text-dark-text">
              {value}
            </p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${change.isPositive ? 'text-ios-green' : 'text-ios-red'}`}>
                {change.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{change.isPositive ? '+' : ''}{change.value}%</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-ios-lg ${iconBg}`}>
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Category Item Component
interface CategoryItemProps {
  name: string
  count: number
  value: number
  percentage: number
  color: string
}

function CategoryItem({ name, count, percentage, color }: CategoryItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-light-text dark:text-dark-text truncate">
            {name}
          </span>
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary ml-2">
            {count} items
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-2 bg-light-separator dark:bg-dark-separator rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary w-12 text-right">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// Stock Overview Item Component
interface StockItemProps {
  product: { name: string; code: string; currentStock: number; minStock: number; averageCost: number }
}

function StockItem({ product }: StockItemProps) {
  const status = getStockStatus(product as any)

  return (
    <div className="flex items-center justify-between p-3 rounded-ios-lg bg-light-separator/50 dark:bg-dark-separator/50">
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-light-text dark:text-dark-text truncate">
          {product.name}
        </h4>
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {product.code}
        </p>
      </div>
      <div className="text-right ml-4">
        <Badge variant={status === 'low' ? 'danger' : status === 'medium' ? 'warning' : 'success'} size="sm">
          {product.currentStock} / {product.minStock}
        </Badge>
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
          {formatCurrency(product.currentStock * product.averageCost)}
        </p>
      </div>
    </div>
  )
}

export function AnalyticsPage() {
  const { t } = useTranslation()
  const { products, categories } = useProductStore()
  const { getTotalPurchases, purchases } = usePurchaseStore()
  const { getTotalRevenue, getTotalProfit, expenses } = useExpenseStore()

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0)
    const stockValue = products.reduce((sum, p) => sum + (p.currentStock * p.averageCost), 0)
    const totalPurchases = getTotalPurchases()
    const totalRevenue = getTotalRevenue()
    const totalProfit = getTotalProfit()

    // Category breakdown
    const categoryData = categories.map(cat => {
      const categoryProducts = products.filter(p => p.category === cat.name)
      const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.currentStock * p.averageCost), 0)
      return {
        name: cat.name,
        color: cat.color,
        count: categoryProducts.length,
        value: categoryValue,
        percentage: stockValue > 0 ? (categoryValue / stockValue) * 100 : 0,
      }
    }).filter(c => c.count > 0).sort((a, b) => b.value - a.value)

    // Top products by value
    const topProducts = [...products]
      .sort((a, b) => (b.currentStock * b.averageCost) - (a.currentStock * a.averageCost))
      .slice(0, 5)

    // Low stock products
    const lowStockProducts = products
      .filter(p => p.currentStock <= p.minStock)
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, 5)

    return {
      totalProducts,
      totalStock,
      stockValue,
      totalPurchases,
      totalRevenue,
      totalProfit,
      categoryData,
      topProducts,
      lowStockProducts,
      purchaseCount: purchases.length,
      expenseCount: expenses.length,
    }
  }, [products, categories, getTotalPurchases, getTotalRevenue, getTotalProfit, purchases, expenses])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
          {t('analytics.title')}
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          {t('analytics.financialSummary')}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.stockValue')}
          value={formatCurrency(analytics.stockValue)}
          icon={<DollarSign className="w-6 h-6 text-ios-blue" />}
          iconBg="bg-ios-blue/10"
          delay={0}
        />
        <StatCard
          title={t('dashboard.totalExpenses')}
          value={formatCurrency(analytics.totalPurchases)}
          icon={<ShoppingCart className="w-6 h-6 text-ios-orange" />}
          iconBg="bg-ios-orange/10"
          delay={0.1}
        />
        <StatCard
          title={t('dashboard.totalRevenue')}
          value={formatCurrency(analytics.totalRevenue)}
          icon={<TrendingUp className="w-6 h-6 text-ios-green" />}
          iconBg="bg-ios-green/10"
          delay={0.2}
        />
        <StatCard
          title={t('dashboard.profit')}
          value={formatCurrency(analytics.totalProfit)}
          icon={<BarChart3 className="w-6 h-6 text-ios-purple" />}
          iconBg="bg-ios-purple/10"
          change={{ value: analytics.totalProfit > 0 ? Math.round((analytics.totalProfit / analytics.totalRevenue) * 100) || 0 : 0, isPositive: analytics.totalProfit >= 0 }}
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-light-text dark:text-dark-text">
              {analytics.totalProducts}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {t('dashboard.products')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-light-text dark:text-dark-text">
              {formatNumber(analytics.totalStock)}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {t('dashboard.totalStock')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-light-text dark:text-dark-text">
              {analytics.purchaseCount}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {t('purchases.title')}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-light-text dark:text-dark-text">
              {analytics.expenseCount}
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">
              {t('expenses.title')}
            </p>
          </div>
        </Card>
      </div>

      {/* Category Breakdown & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.categoryBreakdown')}</CardTitle>
            </CardHeader>
            {analytics.categoryData.length === 0 ? (
              <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">
                {t('common.noData')}
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.categoryData.map(category => (
                  <CategoryItem
                    key={category.name}
                    name={category.name}
                    count={category.count}
                    value={category.value}
                    percentage={category.percentage}
                    color={category.color}
                  />
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Stock Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.stockOverview')}</CardTitle>
              <Badge variant="danger">{analytics.lowStockProducts.length} {t('products.stockStatus.low')}</Badge>
            </CardHeader>
            {analytics.lowStockProducts.length === 0 ? (
              <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">
                {t('common.noData')}
              </p>
            ) : (
              <div className="space-y-2">
                {analytics.lowStockProducts.map(product => (
                  <StockItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Top Products by Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-ios-blue" />
              Top Products by Value
            </CardTitle>
          </CardHeader>
          {analytics.topProducts.length === 0 ? (
            <p className="text-center text-light-text-secondary dark:text-dark-text-secondary py-8">
              {t('common.noData')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-light-text-secondary dark:text-dark-text-secondary border-b border-light-border dark:border-dark-border">
                    <th className="pb-3 font-medium">{t('products.productName')}</th>
                    <th className="pb-3 font-medium text-right">{t('products.currentStock')}</th>
                    <th className="pb-3 font-medium text-right">{t('products.avgCost')}</th>
                    <th className="pb-3 font-medium text-right">{t('products.totalValue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-light-border/50 dark:border-dark-border/50 last:border-0"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-ios-blue/10 text-ios-blue text-sm font-medium flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-light-text dark:text-dark-text">
                              {product.name}
                            </p>
                            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                              {product.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right text-light-text dark:text-dark-text">
                        {formatNumber(product.currentStock)} {t(`products.units.${product.unit}`)}
                      </td>
                      <td className="py-3 text-right text-light-text dark:text-dark-text">
                        {formatCurrency(product.averageCost)}
                      </td>
                      <td className="py-3 text-right font-semibold text-ios-blue">
                        {formatCurrency(product.currentStock * product.averageCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
