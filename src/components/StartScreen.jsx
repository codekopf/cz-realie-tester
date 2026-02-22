/**
 * Entry screen with test information and start button.
 * Displays rules (30 questions, minimum 18 correct, 3 thematic areas) and a button to start a new test.
 *
 * @param {Object} props
 * @param {Function} props.onStart – Callback triggered when "Start Test" button is clicked.
 */
function StartScreen({ onStart }) {
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
    </div>
  )
}

export default StartScreen
