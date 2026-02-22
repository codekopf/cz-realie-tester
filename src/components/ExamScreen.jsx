/**
 * ExamScreen component displays the current state of the test, including progress, navigation dots, the current question,
 * and navigation buttons. It allows users to navigate between questions and submit their answers for evaluation.
 *
 * @param {Object}   props             - The component props.
 * @param {Array}    props.questions   - An array of question objects for the current test.
 * @param {Object}   props.userAnswers - A mapping of question indices to selected answer indices.
 * @param {Function} props.onAnswer    - A callback function to handle answer selection (questionIndex, answerIndex).
 * @param {Function} props.onEvaluate  - A callback function to handle test evaluation.
 * @param {boolean}  props.isEvaluated - A flag indicating whether the test has been evaluated (viewing mode).
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import QuestionCard from './QuestionCard'

/** Formats seconds into MM:SS string. */
function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function ExamScreen({ questions, userAnswers, onAnswer, onEvaluate, isEvaluated, timeLimitMs, testStartTime }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(() => Math.floor(timeLimitMs / 1000))
  const [showTimeUpModal, setShowTimeUpModal] = useState(false)
  const timeUpTriggeredRef = useRef(false)
  const totalQuestions = questions.length
  const answeredCount = Object.keys(userAnswers).length

  // Countdown timer
  useEffect(() => {
    if (isEvaluated || !testStartTime) return

    const tick = () => {
      const elapsed = Date.now() - testStartTime
      const remaining = Math.max(0, Math.floor((timeLimitMs - elapsed) / 1000))
      setRemainingSeconds(remaining)

      if (remaining <= 0 && !timeUpTriggeredRef.current) {
        timeUpTriggeredRef.current = true
        setShowTimeUpModal(true)
      }
    }

    tick() // run immediately
    const intervalId = setInterval(tick, 1000)
    return () => clearInterval(intervalId)
  }, [isEvaluated, testStartTime, timeLimitMs])

  const handleTimeUpAccept = useCallback(() => {
    setShowTimeUpModal(false)
    onEvaluate()
  }, [onEvaluate])

  const isWarning = !isEvaluated && remainingSeconds <= 300 && remainingSeconds > 60 // last 5 minutes
  const isCritical = !isEvaluated && remainingSeconds <= 60 // last minute

  const goTo = (index) => {
    setCurrentIndex(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goPrev = () => {
    if (currentIndex > 0) goTo(currentIndex - 1)
  }

  const goNext = () => {
    if (currentIndex < totalQuestions - 1) goTo(currentIndex + 1)
  }

  const getDotClass = (index) => {
    const classes = ['question-dot']
    if (index === currentIndex) classes.push('active')

    if (isEvaluated) {
      if (userAnswers[index] !== undefined) {
        if (userAnswers[index] === questions[index].correctAnswer) {
          classes.push('correct-dot')
        } else {
          classes.push('incorrect-dot')
        }
      }
    } else {
      if (userAnswers[index] !== undefined) classes.push('answered')
    }

    return classes.join(' ')
  }

  return (
    <div>
      {/* Time-up modal */}
      {showTimeUpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">&#9200;</div>
            <h2 className="modal-title">Cas vyprsel!</h2>
            <p className="modal-text">
              Casovy limit 30 minut pro dokonceni testu vyprsel.
              Vas test bude nyni automaticky vyhodnocen s dosud zadanymi odpovemi.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleTimeUpAccept}>
              Rozumim, vyhodnotit test
            </button>
          </div>
        </div>
      )}

      {/* Timer */}
      {!isEvaluated && (
        <div className={`exam-timer ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
          <span className="timer-icon">&#9200;</span>
          <span className="timer-value">{formatTime(remainingSeconds)}</span>
          <span className="timer-label">zbyvajici cas</span>
        </div>
      )}

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="label">Postup</span>
          <span className="count">
            {answeredCount} / {totalQuestions} zodpovězeno
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question dots navigator */}
      <div className="question-dots">
        {questions.map((_, index) => (
          <button
            key={index}
            className={getDotClass(index)}
            onClick={() => goTo(index)}
            title={`Otázka ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current question */}
      <QuestionCard
        question={questions[currentIndex]}
        questionIndex={currentIndex}
        totalQuestions={totalQuestions}
        selectedAnswer={userAnswers[currentIndex]}
        onAnswer={onAnswer}
        isEvaluated={isEvaluated}
      />

      {/* Navigation */}
      <div className="question-nav">
        <button
          className="btn btn-outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          &#8592; Předchozí
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <button className="btn btn-primary" onClick={goNext}>
            Další &#8594;
          </button>
        ) : (
          !isEvaluated && (
            <button
              className="btn btn-success"
              onClick={onEvaluate}
            >
              Vyhodnotit test
            </button>
          )
        )}
      </div>

      {/* Evaluate button (always visible if not yet evaluated) */}
      {!isEvaluated && (
        <div className="evaluate-bar">
          <p>
            {answeredCount < totalQuestions
              ? `Zbývá zodpovědět ${totalQuestions - answeredCount} otázek.`
              : 'Všechny otázky zodpovězeny!'}
          </p>
          <button className="btn btn-success" onClick={onEvaluate}>
            Vyhodnotit test
          </button>
        </div>
      )}
    </div>
  )
}

export default ExamScreen
