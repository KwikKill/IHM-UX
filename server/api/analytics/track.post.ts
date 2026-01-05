import { updateSessionInfo, addEventToSession } from "../../utils/db"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { sessionId, eventType, eventData, userAgent, screenWidth, screenHeight } = body

    if (!sessionId || !eventType) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      })
    }

    // Update session info if provided
    if (userAgent || screenWidth || screenHeight) {
      updateSessionInfo(sessionId, {
        userAgent: userAgent || "",
        screenWidth: screenWidth || 0,
        screenHeight: screenHeight || 0,
      })
    }

    // Add event to session
    addEventToSession(sessionId, {
      type: eventType,
      data: eventData,
      timestamp: Date.now(),
    })

    return { success: true }
  } catch (error) {
    console.error("[Analytics API] Error tracking event:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to track event",
    })
  }
})
