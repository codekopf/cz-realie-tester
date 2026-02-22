/**
 * Main application component.
 *
 * Manages navigation between screens (start, exam progress, results), generates random tests and evaluates results.
 * Persists the last 10 test results in localStorage so users can review past attempts.
 */
import { useState, useCallback, useRef } from 'react'
import './App.css'
import questionsData from './data/questions.json'
import StartScreen from './components/StartScreen'
import ExamScreen from './components/ExamScreen'
import ResultsScreen from './components/ResultsScreen'
import { getTestHistory, saveTestResult, removeTestEntry } from './testHistory'

const QUESTIONS_PER_TEST = 30
const PASS_THRESHOLD = 18
const TIME_LIMIT_MS = 30 * 60 * 1000 // 30 minutes in milliseconds

/** Generates a new test - randomly selects one question from each of the 30 thematic groups. */
function generateTest() {
  return questionsData.map((group) => {
    const randomIndex = Math.floor(Math.random() * group.questions.length)
    return {
      groupId: group.id,
      topic: group.topic,
      ...group.questions[randomIndex],
    }
  })
}

function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'exam' | 'results'
  const [testQuestions, setTestQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [currentResults, setCurrentResults] = useState(null)
  const [history, setHistory] = useState(() => getTestHistory())
  const testStartTimeRef = useRef(null)

  const startNewTest = useCallback(() => {
    const test = generateTest()
    setTestQuestions(test)
    setUserAnswers({})
    setIsEvaluated(false)
    setCurrentResults(null)
    testStartTimeRef.current = Date.now()
    setScreen('exam')
    window.scrollTo(0, 0)
  }, [])

  const handleAnswer = useCallback((questionIndex, answerIndex) => {
    if (isEvaluated) return
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }, [isEvaluated])

  const computeResults = useCallback((questions, answers) => {
    let correct = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: QUESTIONS_PER_TEST,
      passed: correct >= PASS_THRESHOLD,
      percentage: Math.round((correct / QUESTIONS_PER_TEST) * 100),
    }
  }, [])

  const getElapsedSeconds = useCallback(() => {
    if (!testStartTimeRef.current) return 0
    return Math.floor((Date.now() - testStartTimeRef.current) / 1000)
  }, [])

  const handleEvaluate = useCallback(() => {
    const elapsedSeconds = getElapsedSeconds()
    setIsEvaluated(true)
    setScreen('results')
    window.scrollTo(0, 0)

    // Save to history
    const results = computeResults(testQuestions, userAnswers)
    results.elapsedSeconds = elapsedSeconds
    setCurrentResults(results)
    saveTestResult({ questions: testQuestions, userAnswers, results })
    setHistory(getTestHistory())
  }, [testQuestions, userAnswers, computeResults, getElapsedSeconds])

  const handleReviewQuestions = useCallback(() => {
    setScreen('exam')
    window.scrollTo(0, 0)
  }, [])

  /** Load a past test from history for review (read-only evaluated mode). */
  const handleReviewHistoryEntry = useCallback((entry) => {
    setTestQuestions(entry.questions)
    setUserAnswers(entry.userAnswers)
    setIsEvaluated(true)
    setCurrentResults(entry.results)
    setScreen('results')
    window.scrollTo(0, 0)
  }, [])

  const handleBackToStart = useCallback(() => {
    setScreen('start')
    window.scrollTo(0, 0)
  }, [])

  const handleDeleteEntry = useCallback((id) => {
    removeTestEntry(id)
    setHistory(getTestHistory())
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Test z českých reálií</h1>
        <p>Příprava na zkoušku k udělení státního občanství ČR</p>
      </header>

      <main className="app-container">
        {screen === 'start' && (
          <StartScreen
            onStart={startNewTest}
            history={history}
            onReviewEntry={handleReviewHistoryEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}

        {screen === 'exam' && (
          <ExamScreen
            questions={testQuestions}
            userAnswers={userAnswers}
            onAnswer={handleAnswer}
            onEvaluate={handleEvaluate}
            isEvaluated={isEvaluated}
            timeLimitMs={TIME_LIMIT_MS}
            testStartTime={testStartTimeRef.current}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            questions={testQuestions}
            userAnswers={userAnswers}
            results={currentResults || computeResults(testQuestions, userAnswers)}
            onNewTest={startNewTest}
            onReview={handleReviewQuestions}
            onBackToStart={handleBackToStart}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>
          Zdroj otázek:{' '}
          <a
            href="https://cestina-pro-cizince.cz/obcanstvi/databanka-uloh/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Databanka testových úloh z českých reálií
          </a>
          {' '}&mdash; Národní pedagogický institut České republiky
        </p>
      </footer>
    </div>
  )
}

export default App
