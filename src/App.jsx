/**
 * Main application component.
 *
 * Manages navigation between screens (start, exam progress, results), generates random tests and evaluates results.
 */
import { useState, useCallback } from 'react'
import './App.css'
import questionsData from './data/questions.json'
import StartScreen from './components/StartScreen'
import ExamScreen from './components/ExamScreen'
import ResultsScreen from './components/ResultsScreen'

const QUESTIONS_PER_TEST = 30
const PASS_THRESHOLD = 18

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

  const startNewTest = useCallback(() => {
    const test = generateTest()
    setTestQuestions(test)
    setUserAnswers({})
    setIsEvaluated(false)
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

  const handleEvaluate = useCallback(() => {
    setIsEvaluated(true)
    setScreen('results')
    window.scrollTo(0, 0)
  }, [])

  const handleReviewQuestions = useCallback(() => {
    setScreen('exam')
    window.scrollTo(0, 0)
  }, [])

  const getResults = useCallback(() => {
    let correct = 0
    testQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: QUESTIONS_PER_TEST,
      passed: correct >= PASS_THRESHOLD,
      percentage: Math.round((correct / QUESTIONS_PER_TEST) * 100),
    }
  }, [testQuestions, userAnswers])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Test z českých reálií</h1>
        <p>Příprava na zkoušku k udělení státního občanství ČR</p>
      </header>

      <main className="app-container">
        {screen === 'start' && (
          <StartScreen onStart={startNewTest} />
        )}

        {screen === 'exam' && (
          <ExamScreen
            questions={testQuestions}
            userAnswers={userAnswers}
            onAnswer={handleAnswer}
            onEvaluate={handleEvaluate}
            isEvaluated={isEvaluated}
          />
        )}

        {screen === 'results' && (
          <ResultsScreen
            questions={testQuestions}
            userAnswers={userAnswers}
            results={getResults()}
            onNewTest={startNewTest}
            onReview={handleReviewQuestions}
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
