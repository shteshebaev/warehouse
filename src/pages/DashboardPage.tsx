import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react'
import { useProductStore, usePurchaseStore, useExpenseStore } from '@/store'
import { Card, CardHeader, CardTitle, Button, Badge } from '@/shared/ui'
import { formatCurrency, formatNumber, getStockStatus } from '@/shared/utils/helpers'

// KPI Card Component
interface KPICardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  trend?: 'up' | 'down'
  delay?: number
}

function KPICard({ title, value, subtitle, icon, iconBg, trend, delay = 0 }: KPICardProps) {
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
            {subtitle && (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1 flex items-center gap-1">
                {trend && (
                  trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-ios-green" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-ios-red" />
                  )
                )}
                {subtitle}
              </p>
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

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { products, getLowStockProducts } = useProductStore()
  const { getTotalPurchases, purchases } = usePurchaseStore()
  const { getTotalRevenue, getTotalProfit, expenses } = useExpenseStore()

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0)
    const stockValue = products.reduce((sum, p) => sum + (p.currentStock * p.averageCost), 0)
    const totalPurchases = getTotalPurchases()
    const totalRevenue = getTotalRevenue()
    const totalProfit = getTotalProfit()
    const lowStockProducts = getLowStockProducts()

    return {
      totalStock,
      stockValue,
      totalPurchases,
      totalRevenue,
      totalProfit,
      lowStockProducts,
    }
  }, [products, getTotalPurchases, getTotalRevenue, getTotalProfit, getLowStockProducts])

  // Recent transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...purchases.map(p => ({ ...p, type: 'purchase' as const })),
      ...expenses.map(e => ({ ...e, type: 'expense' as const })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    return allTransactions
  }, [purchases, expenses])

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t('dashboard.title')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {products.length} {t('dashboard.products')}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('dashboard.totalStock')}
          value={formatNumber(kpis.totalStock)}
          subtitle={`${products.length} ${t('dashboard.products')}`}
          icon={<Package className="w-6 h-6 text-ios-blue" />}
          iconBg="bg-ios-blue/10"
          delay={0}
        />
        <KPICard
          title={t('dashboard.stockValue')}
          value={formatCurrency(kpis.stockValue)}
          icon={<DollarSign className="w-6 h-6 text-ios-green" />}
          iconBg="bg-ios-green/10"
          delay={0.1}
        />
        <KPICard
          title={t('dashboard.totalRevenue')}
          value={formatCurrency(kpis.totalRevenue)}
          trend="up"
          icon={<TrendingUp className="w-6 h-6 text-ios-purple" />}
          iconBg="bg-ios-purple/10"
          delay={0.2}
        />
        <KPICard
          title={t('dashboard.profit')}
          value={formatCurrency(kpis.totalProfit)}
          trend={kpis.totalProfit >= 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-6 h-6 text-ios-orange" />}
          iconBg="bg-ios-orange/10"
          delay={0.3}
        />
      </div>

      {/* Quick Actions & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/products')}
                leftIcon={<Plus className="w-4 h-4" />}
                className="justify-start"
              >
                {t('products.addProduct')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/purchases')}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
                className="justify-start"
              >
                {t('purchases.addPurchase')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/expenses')}
                leftIcon={<TrendingDown className="w-4 h-4" />}
                className="justify-start"
              >
                {t('expenses.addExpense')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/analytics')}
                leftIcon={<TrendingUp className="w-4 h-4" />}
                className="justify-start"
              >
                {t('nav.analytics')}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-ios-orange" />
                {t('dashboard.lowStockAlert')}
              </CardTitle>
              <Badge variant="warning">{kpis.lowStockProducts.length}</Badge>
            </CardHeader>
            {kpis.lowStockProducts.length === 0 ? (
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-center py-4">
                {t('common.noData')}
              </p>
            ) : (
              <ul className="space-y-2">
                {kpis.lowStockProducts.slice(0, 4).map(product => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-ios-lg bg-light-separator/50 dark:bg-dark-separator/50"
                  >
                    <div>
                      <p className="font-medium text-light-text dark:text-dark-text text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {product.code}
                      </p>
                    </div>
                    <Badge variant={getStockStatus(product) === 'low' ? 'danger' : 'warning'} size="sm">
                      {product.currentStock} / {product.minStock}
                    </Badge>
                  </li>
                ))}
                {kpis.lowStockProducts.length > 4 && (
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full text-center text-sm text-ios-blue py-2 hover:underline"
                  >
                    {t('common.all')} ({kpis.lowStockProducts.length})
                  </button>
                )}
              </ul>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentTransactions')}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t('common.all')}
            </Button>
          </CardHeader>
          {recentTransactions.length === 0 ? (
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-center py-8">
              {t('common.noData')}
            </p>
          ) : (
            <ul className="space-y-2">
              {recentTransactions.map(transaction => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-ios-lg bg-light-separator/50 dark:bg-dark-separator/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-ios ${
                      transaction.type === 'purchase'
                        ? 'bg-ios-green/10'
                        : 'bg-ios-red/10'
                    }`}>
                      {transaction.type === 'purchase' ? (
                        <ShoppingCart className={`w-4 h-4 text-ios-green`} />
                      ) : (
                        <TrendingDown className={`w-4 h-4 text-ios-red`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-light-text dark:text-dark-text text-sm">
                        {transaction.productName}
                      </p>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        {transaction.quantity} {t('dashboard.items')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.type === 'purchase' ? 'text-ios-red' : 'text-ios-green'
                    }`}>
                      {transaction.type === 'purchase' ? '-' : '+'}
                      {formatCurrency(transaction.type === 'purchase'
                        ? (transaction as any).totalCost
                        : (transaction as any).salePrice ? (transaction as any).quantity * (transaction as any).salePrice : 0
                      )}
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
