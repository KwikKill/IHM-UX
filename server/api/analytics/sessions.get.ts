import { getAllSessions } from "../../utils/db"

export default defineEventHandler(async () => {
  try {
    const sessions = getAllSessions()

    // Return sessions sorted by start time (newest first)
    return sessions.sort((a, b) => b.startTime - a.startTime)
  } catch (error) {
    console.error("[Analytics API] Error fetching sessions:", error)
    return []
  }
})
