import { getSession } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Session ID required",
      })
    }

    const session = getSession(id)

    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: "Session not found",
      })
    }

    return session
  } catch (error) {
    console.error("[Analytics API] Error fetching session:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch session",
    })
  }
})
