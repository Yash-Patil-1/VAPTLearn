import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Commands from './pages/Commands'
import CommandDetail from './pages/CommandDetail'
import Phases from './pages/Phases'
import Tools from './pages/Tools'
import MitreView from './pages/MitreView'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/commands/:id" element={<CommandDetail />} />
          <Route path="/phases" element={<Phases />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/mitre" element={<MitreView />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  )
}
