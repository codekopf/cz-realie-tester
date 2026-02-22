/**
 * Shows a single question with its answers.
 * Supports both text and image answers.
 * After evaluation, visually highlights the correct and incorrect answers (green/red + ✓/✗ icons).
 *
 * @param {Object}   props
 * @param {Object}   props.question       – The question object (question, answers, correctAnswer, topic, …).
 * @param {number}   props.questionIndex  – The index of the question within the test (0–29).
 * @param {number}   props.totalQuestions – The total number of questions.
 * @param {number}   props.selectedAnswer – The index of the selected answer (or undefined).
 * @param {Function} props.onAnswer       – Callback to record the answer.
 * @param {boolean}  props.isEvaluated    – Whether the test is evaluated (review mode).
 */
const LETTERS = ['A', 'B', 'C', 'D']

function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  isEvaluated,
}) {
  const hasImageAnswers = question.answers.some((a) => a.image)

  const getAnswerClass = (answerIndex) => {
    const classes = ['answer-option']

    if (isEvaluated) {
      classes.push('disabled')
      if (answerIndex === question.correctAnswer) {
        classes.push(selectedAnswer === answerIndex ? 'correct' : 'show-correct')
      } else if (answerIndex === selectedAnswer) {
        classes.push('incorrect')
      }
    } else {
      if (answerIndex === selectedAnswer) {
        classes.push('selected')
      }
    }

    return classes.join(' ')
  }

  const getResultIcon = (answerIndex) => {
    if (!isEvaluated) return null
    if (answerIndex === question.correctAnswer) {
      return <span className="answer-result-icon">&#10004;</span>
    }
    if (answerIndex === selectedAnswer && answerIndex !== question.correctAnswer) {
      return <span className="answer-result-icon">&#10008;</span>
    }
    return null
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          Otázka {questionIndex + 1} / {totalQuestions}
        </span>
        <span className="question-topic">{question.topic}</span>
      </div>

      <div className="question-body">
        <p className="question-text">{question.question}</p>

        {question.questionImage && (
          <div className="question-image">
            <img src={question.questionImage} alt="Obrázek k otázce" />
          </div>
        )}

        {hasImageAnswers ? (
          <div className="image-answers-grid">
            {question.answers.map((answer, ansIdx) => (
              <div
                key={ansIdx}
                className={getAnswerClass(ansIdx)}
                onClick={() => !isEvaluated && onAnswer(questionIndex, ansIdx)}
              >
                <div className="answer-label">
                  <span className="answer-letter">{LETTERS[ansIdx]}</span>
                  <div className="answer-image-wrapper">
                    <img src={answer.image} alt={`Odpověď ${LETTERS[ansIdx]}`} />
                  </div>
                  {getResultIcon(ansIdx)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="answers-list">
            {question.answers.map((answer, ansIdx) => (
              <div
                key={ansIdx}
                className={getAnswerClass(ansIdx)}
                onClick={() => !isEvaluated && onAnswer(questionIndex, ansIdx)}
              >
                <div className="answer-label">
                  <span className="answer-letter">{LETTERS[ansIdx]}</span>
                  <span className="answer-text">{answer.text}</span>
                  {getResultIcon(ansIdx)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionCard
