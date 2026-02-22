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
import { useState } from 'react'
import QuestionCard from './QuestionCard'

function ExamScreen({ questions, userAnswers, onAnswer, onEvaluate, isEvaluated }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalQuestions = questions.length
  const answeredCount = Object.keys(userAnswers).length

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
