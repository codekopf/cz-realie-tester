/**
 * QuestionReviewScreen displays all 300 questions from the database with per-question
 * success/failure statistics computed from the user's test history.
 *
 * Features:
 * - Shows each question with success rate (e.g. "4/5 = 80%")
 * - Sortable by most successful, least successful, topic, or group
 * - Users can select individual questions and start a custom test
 * - Custom test results are NOT stored in history
 *
 * @param {Object}   props
 * @param {Array}    props.questionStats – Array from getQuestionStatsArray().
 * @param {Function} props.onStartCustomTest – Callback with array of selected question objects.
 * @param {Function} props.onBack – Callback to go back to start screen.
 */
import { useState, useMemo } from 'react'

const SORT_OPTIONS = {
  LEAST_SUCCESS: 'least-success',
  MOST_SUCCESS: 'most-success',
  TOPIC: 'topic',
  GROUP: 'group',
}

function QuestionReviewScreen({ questionStats, onStartCustomTest, onBack }) {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.LEAST_SUCCESS)
  const [selectedQuestions, setSelectedQuestions] = useState(new Set())
  const [filterTopic, setFilterTopic] = useState('')
  const [filterAttempted, setFilterAttempted] = useState('all') // 'all' | 'attempted' | 'not-attempted'

  // Get unique topics for filter dropdown
  const topics = useMemo(() => {
    const topicSet = new Set(questionStats.map((q) => q.topic))
    return Array.from(topicSet).sort()
  }, [questionStats])

  // Filter and sort
  const sortedStats = useMemo(() => {
    let filtered = [...questionStats]

    // Filter by topic
    if (filterTopic) {
      filtered = filtered.filter((q) => q.topic === filterTopic)
    }

    // Filter by attempted status
    if (filterAttempted === 'attempted') {
      filtered = filtered.filter((q) => q.total > 0)
    } else if (filterAttempted === 'not-attempted') {
      filtered = filtered.filter((q) => q.total === 0)
    }

    // Sort
    switch (sortBy) {
      case SORT_OPTIONS.LEAST_SUCCESS:
        filtered.sort((a, b) => {
          // Attempted questions first, then by percentage ascending
          if (a.total === 0 && b.total === 0) return 0
          if (a.total === 0) return 1
          if (b.total === 0) return -1
          return a.percentage - b.percentage
        })
        break
      case SORT_OPTIONS.MOST_SUCCESS:
        filtered.sort((a, b) => {
          if (a.total === 0 && b.total === 0) return 0
          if (a.total === 0) return 1
          if (b.total === 0) return -1
          return b.percentage - a.percentage
        })
        break
      case SORT_OPTIONS.TOPIC:
        filtered.sort((a, b) => a.topic.localeCompare(b.topic, 'cs'))
        break
      case SORT_OPTIONS.GROUP:
        filtered.sort((a, b) => a.groupId - b.groupId)
        break
    }

    return filtered
  }, [questionStats, sortBy, filterTopic, filterAttempted])

  const toggleQuestion = (questionText) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev)
      if (next.has(questionText)) {
        next.delete(questionText)
      } else {
        next.add(questionText)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedQuestions.size === sortedStats.length) {
      setSelectedQuestions(new Set())
    } else {
      setSelectedQuestions(new Set(sortedStats.map((q) => q.questionText)))
    }
  }

  const handleStartCustomTest = () => {
    const selected = questionStats
      .filter((q) => selectedQuestions.has(q.questionText))
      .map((q) => q.questionObj)
    if (selected.length > 0) {
      onStartCustomTest(selected)
    }
  }

  const getSuccessRateDisplay = (stat) => {
    if (stat.total === 0) {
      return { text: 'Nezkoušeno', className: 'stat-not-attempted' }
    }
    const pct = stat.percentage
    let className = 'stat-good'
    if (pct < 50) className = 'stat-bad'
    else if (pct < 75) className = 'stat-medium'
    return {
      text: `${stat.succeeded}/${stat.total} (${pct}%)`,
      className,
    }
  }

  const attemptedCount = questionStats.filter((q) => q.total > 0).length

  return (
    <div className="review-screen">
      <div className="review-header">
        <button className="btn btn-outline" onClick={onBack}>
          &#8592; Zpět na úvod
        </button>
        <h2>Přehled otázek</h2>
        <p className="review-subtitle">
          Celkem {questionStats.length} otázek &middot; {attemptedCount} zodpovězeno v testech
        </p>
      </div>

      {/* Controls */}
      <div className="review-controls">
        <div className="review-controls-row">
          <div className="review-control-group">
            <label htmlFor="sort-select">Řadit podle:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="review-select"
            >
              <option value={SORT_OPTIONS.LEAST_SUCCESS}>Nejméně úspěšné</option>
              <option value={SORT_OPTIONS.MOST_SUCCESS}>Nejvíce úspěšné</option>
              <option value={SORT_OPTIONS.TOPIC}>Téma (abecedně)</option>
              <option value={SORT_OPTIONS.GROUP}>Číslo okruhu</option>
            </select>
          </div>

          <div className="review-control-group">
            <label htmlFor="topic-filter">Téma:</label>
            <select
              id="topic-filter"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="review-select"
            >
              <option value="">Všechna témata</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="review-control-group">
            <label htmlFor="attempted-filter">Stav:</label>
            <select
              id="attempted-filter"
              value={filterAttempted}
              onChange={(e) => setFilterAttempted(e.target.value)}
              className="review-select"
            >
              <option value="all">Všechny</option>
              <option value="attempted">Zkoušené</option>
              <option value="not-attempted">Nezkoušené</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selection bar */}
      <div className="review-selection-bar">
        <div className="review-selection-info">
          <button
            className="btn btn-outline btn-sm"
            onClick={toggleAll}
          >
            {selectedQuestions.size === sortedStats.length && sortedStats.length > 0
              ? 'Zrušit výběr'
              : 'Vybrat vše'}
          </button>
          <span className="review-selection-count">
            {selectedQuestions.size > 0
              ? `Vybráno: ${selectedQuestions.size} otázek`
              : 'Vyberte otázky pro vlastní test'}
          </span>
        </div>
        {selectedQuestions.size > 0 && (
          <button
            className="btn btn-primary"
            onClick={handleStartCustomTest}
          >
            Spustit vlastní test ({selectedQuestions.size} otázek)
          </button>
        )}
      </div>

      {/* Question list */}
      <div className="review-list">
        {sortedStats.map((stat) => {
          const rate = getSuccessRateDisplay(stat)
          const isSelected = selectedQuestions.has(stat.questionText)

          return (
            <div
              key={`${stat.groupId}-${stat.questionText}`}
              className={`review-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleQuestion(stat.questionText)}
            >
              <div className="review-item-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleQuestion(stat.questionText)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="review-item-content">
                <div className="review-item-meta">
                  <span className="review-item-group">Okruh {stat.groupId}</span>
                  <span className="review-item-topic">{stat.topic}</span>
                </div>
                <div className="review-item-question">{stat.questionText}</div>
              </div>
              <div className={`review-item-stat ${rate.className}`}>
                {rate.text}
              </div>
            </div>
          )
        })}
      </div>

      {sortedStats.length === 0 && (
        <div className="review-empty">
          Žádné otázky neodpovídají zvoleným filtrům.
        </div>
      )}
    </div>
  )
}

export default QuestionReviewScreen
