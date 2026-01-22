import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { PriorityDistribution } from '../../hooks/useStatistics'
import { useLanguage } from '../../contexts/LanguageContext'
import styles from '../../styles/statistics/PriorityDistributionChart.module.css'

interface PriorityDistributionChartProps {
  data: PriorityDistribution[]
}

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
}

export function PriorityDistributionChart({ data }: PriorityDistributionChartProps) {
  const { t } = useLanguage()
  const chartData = data.filter((item) => item.count > 0)

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>{t('statsPriorityChart')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.priority} (${entry.count})`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.priority]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value?: number) => [`${value ?? 0}`, 'Count']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
