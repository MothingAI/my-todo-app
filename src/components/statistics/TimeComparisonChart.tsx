import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TimeStats } from '../../hooks/useStatistics'
import { useLanguage } from '../../contexts/LanguageContext'
import styles from '../../styles/statistics/TimeComparisonChart.module.css'

interface TimeComparisonChartProps {
  data: TimeStats
}

export function TimeComparisonChart({ data }: TimeComparisonChartProps) {
  const { t } = useLanguage()
  const chartData = [
    {
      name: 'Average',
      estimated: Math.round(data.averageEstimated),
      actual: Math.round(data.averageActual),
    },
    {
      name: 'Total',
      estimated: Math.round(data.totalEstimated / 60), // Convert to hours
      actual: Math.round(data.totalActual / 60), // Convert to hours
    },
  ]

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>{t('statsTimeChart')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" className={styles.axisLabel} />
          <YAxis dataKey="name" type="category" className={styles.axisLabel} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value?: number, name?: string) => [
              `${value ?? 0} ${chartData[0].name === 'Average' ? 'min' : 'hours'}`,
              name === 'estimated' ? 'Estimated' : 'Actual',
            ]}
          />
          <Bar dataKey="estimated" fill="#8884d8" name="Estimated" radius={[0, 4, 4, 0]} />
          <Bar dataKey="actual" fill="#82ca9d" name="Actual" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {data.variance > 0 && (
        <p className={styles.variance}>
          {t('statsAverageVariance', { variance: Math.round(data.variance) })}
        </p>
      )}
    </div>
  )
}
