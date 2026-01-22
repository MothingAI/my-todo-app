import { DailyCompletionChart } from './DailyCompletionChart'
import { PriorityDistributionChart } from './PriorityDistributionChart'
import { TimeComparisonChart } from './TimeComparisonChart'
import { useStatistics } from '../../hooks/useStatistics'
import { useLanguage } from '../../contexts/LanguageContext'
import styles from '../../styles/statistics/StatisticsPanel.module.css'

export function StatisticsPanel() {
  const { t } = useLanguage()
  const {
    dailyStats,
    priorityDistribution,
    timeStats,
    completionRate,
    overdueCount,
    totalTodos,
    activeTodosCount,
    completedTodosCount,
  } = useStatistics()

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{t('statsTitle')}</h2>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.card} ${styles.total}`}>
          <div className={styles.cardLabel}>{t('statsTotal')}</div>
          <div className={styles.cardValue}>{totalTodos}</div>
        </div>
        <div className={`${styles.card} ${styles.active}`}>
          <div className={styles.cardLabel}>{t('statsActive')}</div>
          <div className={styles.cardValue}>{activeTodosCount}</div>
        </div>
        <div className={`${styles.card} ${styles.completed}`}>
          <div className={styles.cardLabel}>{t('statsCompleted')}</div>
          <div className={styles.cardValue}>{completedTodosCount}</div>
        </div>
        <div className={`${styles.card} ${styles.overdue}`}>
          <div className={styles.cardLabel}>{t('statsOverdue')}</div>
          <div className={styles.cardValue}>{overdueCount}</div>
        </div>
        <div className={`${styles.card} ${styles.rate}`}>
          <div className={styles.cardLabel}>{t('statsCompletionRate')}</div>
          <div className={styles.cardValue}>{completionRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <DailyCompletionChart data={dailyStats} />
        </div>
        <div className={styles.chartContainer}>
          <PriorityDistributionChart data={priorityDistribution} />
        </div>
        <div className={styles.chartContainer}>
          <TimeComparisonChart data={timeStats} />
        </div>
      </div>
    </div>
  )
}
