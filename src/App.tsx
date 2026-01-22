import { useState, lazy, Suspense } from 'react'
import { TodoProvider } from './hooks/useTodos.tsx'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { TimerPanel } from './components/timer/TimerPanel'
import { CalendarView } from './components/calendar/CalendarView'
import { Navigation } from './components/Navigation'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { AnimatedBackground } from './components/AnimatedBackground'
import { UndoNotification } from './components/UndoNotification'
import { Watermark } from './components/Watermark'

// Lazy load statistics panel to reduce initial bundle size
const StatisticsPanel = lazy(() => import('./components/statistics/StatisticsPanel').then((m) => ({ default: m.StatisticsPanel })))

type ViewMode = 'list' | 'calendar' | 'statistics'

function AppContent() {
  const { t } = useLanguage()
  const [currentView, setCurrentView] = useState<ViewMode>('list')

  return (
    <div className="app">
      <AnimatedBackground />
      <header>
        <div className="header-content">
          <h1>{t('appTitle')}</h1>
          <LanguageSwitcher />
        </div>
      </header>
      <main>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />

        {currentView === 'list' && (
          <>
            <TimerPanel />
            <TodoForm />
            <TodoList />
          </>
        )}

        {currentView === 'calendar' && <CalendarView />}

        {currentView === 'statistics' && (
          <Suspense fallback={<div className="loading">Loading statistics...</div>}>
            <StatisticsPanel />
          </Suspense>
        )}
      </main>
      <UndoNotification />
      <Watermark />
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </LanguageProvider>
  )
}

export default App
