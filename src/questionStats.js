/**
 * Computes per-question success/failure statistics from test history.
 *
 * Iterates over all stored test entries and matches each answered question
 * back to the canonical question database using the question text as a key.
 * Returns a map of question text → { succeeded, failed, total, percentage, question, groupId, topic }.
 */
import questionsData from './data/questions.json'

/**
 * Builds a flat list of all questions from the question database,
 * enriched with groupId and topic.
 * @returns {Array<Object>}
 */
export function getAllQuestions() {
  const all = []
  questionsData.forEach((group) => {
    group.questions.forEach((q) => {
      all.push({
        groupId: group.id,
        topic: group.topic,
        ...q,
      })
    })
  })
  return all
}

/**
 * Computes per-question stats from the test history.
 *
 * @param {Array} history – Array of test history entries from getTestHistory().
 * @returns {Map<string, {succeeded: number, failed: number, total: number, percentage: number, question: Object, groupId: number, topic: string}>}
 *   A Map keyed by question text, with stats for each question that was encountered in tests.
 */
export function computeQuestionStats(history) {
  const statsMap = new Map()

  for (const entry of history) {
    if (!entry.questions || !entry.userAnswers) continue

    entry.questions.forEach((q, index) => {
      const key = q.question // question text as unique key
      const userAnswer = entry.userAnswers[index]

      if (userAnswer === undefined) return // question was not answered, skip

      if (!statsMap.has(key)) {
        statsMap.set(key, {
          succeeded: 0,
          failed: 0,
          total: 0,
          percentage: 0,
          question: q,
          groupId: q.groupId,
          topic: q.topic,
        })
      }

      const stat = statsMap.get(key)
      stat.total++
      if (userAnswer === q.correctAnswer) {
        stat.succeeded++
      } else {
        stat.failed++
      }
      stat.percentage = Math.round((stat.succeeded / stat.total) * 100)
    })
  }

  return statsMap
}

/**
 * Returns an array of all questions from the database, each augmented with stats.
 * Questions that were never encountered in history will have zeroed stats.
 *
 * @param {Array} history – Array of test history entries.
 * @returns {Array<{question: string, topic: string, groupId: number, succeeded: number, failed: number, total: number, percentage: number, questionObj: Object}>}
 */
export function getQuestionStatsArray(history) {
  const statsMap = computeQuestionStats(history)
  const allQuestions = getAllQuestions()

  return allQuestions.map((q) => {
    const stat = statsMap.get(q.question)
    return {
      questionText: q.question,
      topic: q.topic,
      groupId: q.groupId,
      succeeded: stat ? stat.succeeded : 0,
      failed: stat ? stat.failed : 0,
      total: stat ? stat.total : 0,
      percentage: stat ? stat.percentage : -1, // -1 means never attempted
      questionObj: q,
    }
  })
}
