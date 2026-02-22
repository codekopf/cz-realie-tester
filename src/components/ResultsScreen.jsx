const LETTERS = ['A', 'B', 'C', 'D']

function ResultsScreen({ questions, userAnswers, results, onNewTest, onReview }) {
  const { correct, total, passed, percentage } = results

  return (
    <div className="results-screen">
      <div className={`result-badge ${passed ? 'passed' : 'failed'}`}>
        <div>
          <span className="score">{correct}</span>
          <span className="out-of">z {total}</span>
        </div>
      </div>

      <h2 className={`result-status ${passed ? 'passed' : 'failed'}`}>
        {passed ? 'Úspěšně jste složili test!' : 'Testem jste neprošli.'}
      </h2>

      <p className="result-detail">
        Správně jste odpověděli na {correct} z {total} otázek ({percentage}%).
        {' '}
        {passed
          ? `K úspěchu stačilo 18 správných odpovědí (60%).`
          : `Pro úspěch je potřeba minimálně 18 správných odpovědí (60%).`}
      </p>

      <div className="result-actions">
        <button className="btn btn-primary btn-lg" onClick={onNewTest}>
          Nový test
        </button>
        <button className="btn btn-outline" onClick={onReview}>
          Zobrazit odpovědi
        </button>
      </div>

      {/* Breakdown */}
      <div className="results-breakdown">
        <h3>Přehled odpovědí</h3>
        {questions.map((q, index) => {
          const userAnswer = userAnswers[index]
          const isCorrect = userAnswer === q.correctAnswer
          const wasAnswered = userAnswer !== undefined

          return (
            <div key={index} className="result-question-item">
              <span className="result-icon">
                {isCorrect ? '✓' : wasAnswered ? '✗' : '—'}
              </span>
              <div className="result-content">
                <div className="result-q-number">
                  {index + 1}. {q.topic}
                </div>
                <div className="result-q-text">
                  {q.question}
                </div>
                {wasAnswered && !isCorrect && (
                  <div className="result-q-answer wrong">
                    Vaše odpověď: {LETTERS[userAnswer]})
                    {q.answers[userAnswer]?.text && ` ${q.answers[userAnswer].text}`}
                  </div>
                )}
                <div className={`result-q-answer right`}>
                  Správná odpověď: {LETTERS[q.correctAnswer]})
                  {q.answers[q.correctAnswer]?.text && ` ${q.answers[q.correctAnswer].text}`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ResultsScreen
