/**
 * Entry screen with test information and start button.
 * Displays rules (30 questions, minimum 18 correct, 3 thematic areas) and a button to start a new test.
 * If there is test history, shows a table of past results with the option to review each one.
 *
 * @param {Object}   props
 * @param {Function} props.onStart       – Callback triggered when "Start Test" button is clicked.
 * @param {Array}    props.history       – Array of past test entries (newest first).
 * @param {Function} props.onReviewEntry – Callback to load a past test for review.
 * @param {Function} props.onDeleteEntry – Callback to delete a past test entry by id.
 */
function StartScreen({ onStart, history, onReviewEntry, onDeleteEntry }) {
  /** Format ISO date string to a human-readable Czech locale format. */
  const formatDate = (isoString) => {
    const d = new Date(isoString)
    return d.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /** Formats seconds into "Xm Ys" string. */
  const formatTime = (totalSeconds) => {
    if (totalSeconds == null) return '—'
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${String(secs).padStart(2, '0')}s`
  }

  return (
    <div className="start-screen">
      <h2>Vítejte u testu z českých reálií</h2>
      <p className="description">
        Tento test simuluje zkoušku z českých reálií, která je součástí
        procesu udělení státního občanství České republiky. Test obsahuje
        30 otázek &mdash; po jedné z každého tematického okruhu.
      </p>

      <div className="info-cards">
        <div className="info-card">
          <div className="label">Počet otázek</div>
          <div className="value">30</div>
        </div>
        <div className="info-card">
          <div className="label">Minimum pro úspěch</div>
          <div className="value">18 (60%)</div>
        </div>
        <div className="info-card">
          <div className="label">Tematické okruhy</div>
          <div className="value">3</div>
        </div>
        <div className="info-card">
          <div className="label">Casovy limit</div>
          <div className="value">30 min</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#546e7a' }}>
          Oblasti testu
        </h3>
        <div className="info-cards">
          <div className="info-card" style={{ textAlign: 'left' }}>
            <div className="label">Občanský základ</div>
            <div className="value" style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a2e' }}>
              16 témat
            </div>
          </div>
          <div className="info-card" style={{ textAlign: 'left' }}>
            <div className="label">Geografie ČR</div>
            <div className="value" style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a2e' }}>
              7 témat
            </div>
          </div>
          <div className="info-card" style={{ textAlign: 'left' }}>
            <div className="label">Historie a kultura ČR</div>
            <div className="value" style={{ fontSize: '1rem', fontWeight: 400, color: '#1a1a2e' }}>
              7 témat
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={onStart}>
        Zahájit test
      </button>

      {history.length > 0 && (
        <div className="history-section">
          <h3 className="history-title">Poslední výsledky</h3>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Datum</th>
                  <th>Cas</th>
                  <th>Skóre</th>
                  <th>Výsledek</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="history-cell-num">{index + 1}</td>
                    <td className="history-cell-date">{formatDate(entry.date)}</td>
                    <td className="history-cell-time">{formatTime(entry.results.elapsedSeconds)}</td>
                    <td className="history-cell-score">
                      {entry.results.correct}/{entry.results.total} ({entry.results.percentage}%)
                    </td>
                    <td>
                      <span className={`history-badge ${entry.results.passed ? 'passed' : 'failed'}`}>
                        {entry.results.passed ? 'Úspěch' : 'Neúspěch'}
                      </span>
                    </td>
                    <td className="history-cell-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onReviewEntry(entry)}
                      >
                        Zobrazit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteEntry(entry.id)}
                      >
                        Smazat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartScreen
