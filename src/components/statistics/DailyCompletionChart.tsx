import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { DailyStats } from '../../hooks/useStatistics'
import { useLanguage } from '../../contexts/LanguageContext'
import styles from '../../styles/statistics/DailyCompletionChart.module.css'

interface DailyCompletionChartProps {
  data: DailyStats[]
}

export function DailyCompletionChart({ data }: DailyCompletionChartProps) {
  const { t } = useLanguage()

  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>{t('statsDailyChart')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" className={styles.axisLabel} />
          <YAxis className={styles.axisLabel} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="completedCount" fill="#4caf50" name={t('statsCompletedLabel')} radius={[4, 4, 0, 0]} />
          <Bar dataKey="addedCount" fill="#3b82f6" name={t('statsAddedLabel')} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
