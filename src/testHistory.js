/**
 * Utilities for persisting test history in localStorage.
 *
 * Stores up to 10 most recent test results. Each entry contains the full test
 * data (questions, user answers, results) so a past test can be reviewed later.
 */

const STORAGE_KEY = 'cz-realie-test-history'
const MAX_ENTRIES = 10

/**
 * Returns the saved test history array (newest first), or an empty array.
 * @returns {Array<{id: string, date: string, results: Object, questions: Array, userAnswers: Object}>}
 */
export function getTestHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Saves a completed test to history. Keeps only the last MAX_ENTRIES.
 *
 * @param {Object} entry
 * @param {Array}  entry.questions   – The 30 test questions.
 * @param {Object} entry.userAnswers – Map of question index → selected answer index.
 * @param {Object} entry.results     – { correct, total, passed, percentage, elapsedSeconds }
 */
export function saveTestResult({ questions, userAnswers, results }) {
  const history = getTestHistory()

  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    questions,
    userAnswers,
    results,
  }

  // Prepend newest, trim to MAX_ENTRIES
  history.unshift(entry)
  if (history.length > MAX_ENTRIES) {
    history.length = MAX_ENTRIES
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // Storage full or unavailable – silently ignore.
  }
}

/**
 * Removes a single test entry from history by its id.
 * @param {string} id – The unique id of the entry to remove.
 */
export function removeTestEntry(id) {
  const history = getTestHistory().filter((entry) => entry.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // Silently ignore.
  }
}
