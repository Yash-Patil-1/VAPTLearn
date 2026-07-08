import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ErrorBoundary from './components/ErrorBoundary'
import Dashboard from './pages/Dashboard'
import Commands from './pages/Commands'
import CommandDetail from './pages/CommandDetail'
import Phases from './pages/Phases'
import Tools from './pages/Tools'
import MitreView from './pages/MitreView'
import Quiz from './pages/Quiz'
import Learn from './pages/Learn'
import Glossary from './pages/Glossary'
import LessonView from './pages/LessonView'

export default function App() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-8">
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:id" element={<LessonView />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/commands/:id" element={<CommandDetail />} />
            <Route path="/phases" element={<Phases />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/mitre" element={<MitreView />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  )
}
