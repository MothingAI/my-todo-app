import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import { TodoItemWithMeta } from './TodoItemWithMeta'
import styles from '../styles/TodoList.module.css'

export function TodoList() {
  const { t } = useLanguage()
  const { activeTodos, completedTodos } = useTodos()

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('todoSectionActive')}</h2>
        {activeTodos.length === 0 ? (
          <p className={styles.emptyState} data-testid="empty-state">
            {t('todoEmpty')}
          </p>
        ) : (
          <ul className={styles.list} role="list">
            {activeTodos.map((todo) => (
              <TodoItemWithMeta key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </section>

      {completedTodos.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('todoSectionCompleted')}</h2>
          <ul className={styles.list} role="list">
            {completedTodos.map((todo) => (
              <TodoItemWithMeta key={todo.id} todo={todo} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
