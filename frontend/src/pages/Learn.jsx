import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react'
import axios from 'axios'
import SkeletonLoader from '../components/SkeletonLoader'
import ErrorMessage from '../components/ErrorMessage'

export default function Learn() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadLessons = () => {
    setLoading(true); setError(false)
    axios.get('/api/lessons')
      .then(r => { setLessons(r.data.lessons); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }

  useEffect(() => { loadLessons() }, [])

  if (error) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-ice-white mb-2">Guided Lessons</h1>
        <p className="text-ash-steel mb-8">Learn VAPT methodology step by step with active-recall checkpoints.</p>
        <ErrorMessage onRetry={loadLessons} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-ice-white mb-2">Guided Lessons</h1>
      <p className="text-ash-steel mb-8">
        Learn VAPT methodology step by step with active-recall checkpoints.
      </p>

      {loading ? (
        <SkeletonLoader variant="lesson" count={7} />
      ) : (
      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            to={`/learn/${lesson.id}`}
            className="card block hover:border-[#B4FF00]/30 transition-all duration-200 group"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-sm"
                style={{ backgroundColor: 'rgba(180, 255, 0, 0.08)' }}>
                <span className="text-[#B4FF00] font-bold text-sm font-mono">{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-ice-white font-medium group-hover:text-[#B4FF00] transition-colors">
                    {lesson.title}
                  </h3>
                  {lesson.learned && (
                    <CheckCircle className="w-4 h-4 text-[#B4FF00] shrink-0" />
                  )}
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono"
                    style={{ backgroundColor: 'rgba(180, 255, 0, 0.06)', border: '1px solid rgba(180, 255, 0, 0.2)', color: '#B4FF00' }}>
                    <BookOpen className="w-3 h-3" />
                    {lesson.section_count} sections
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-mono"
                    style={{ backgroundColor: 'rgba(124, 131, 122, 0.1)', border: '1px solid rgba(124, 131, 122, 0.2)', color: '#7C837A' }}>
                    {lesson.checkpoint_count} questions
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-ash-steel group-hover:text-[#B4FF00] transition-colors shrink-0 mt-2" />
            </div>
          </Link>          ))}
      </div>
      )}
    </div>
  )
}
