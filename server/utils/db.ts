import fs from "fs"
import path from "path"

interface ClickEvent {
  x: number
  y: number
  timestamp: number
  target: string
  page: string
}

interface PageView {
  page: string
  timestamp: number
  referrer: string
}

interface SessionEvent {
  type: "click" | "pageView" | "customEvent"
  data: any
  timestamp: number
}

interface Session {
  sessionId: string
  startTime: number
  events: SessionEvent[]
  userAgent: string
  screenWidth: number
  screenHeight: number
}

const DATA_DIR = path.join(process.cwd(), "analytics-data")
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Ensure sessions file exists
if (!fs.existsSync(SESSIONS_FILE)) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify([]))
}

export function getAllSessions(): Session[] {
  try {
    const data = fs.readFileSync(SESSIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading sessions:", error)
    return []
  }
}

export function getSession(sessionId: string): Session | null {
  const sessions = getAllSessions()
  return sessions.find((s) => s.sessionId === sessionId) || null
}

export function saveSession(session: Session) {
  const sessions = getAllSessions()
  const existingIndex = sessions.findIndex((s) => s.sessionId === session.sessionId)

  if (existingIndex >= 0) {
    sessions[existingIndex] = session
  } else {
    sessions.push(session)
  }

  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

export function addEventToSession(sessionId: string, event: SessionEvent) {
  let session = getSession(sessionId)

  if (!session) {
    session = {
      sessionId,
      startTime: Date.now(),
      events: [],
      userAgent: "",
      screenWidth: 0,
      screenHeight: 0,
    }
  }

  session.events.push(event)
  saveSession(session)
}

export function updateSessionInfo(sessionId: string, info: Partial<Session>) {
  let session = getSession(sessionId)

  if (!session) {
    session = {
      sessionId,
      startTime: Date.now(),
      events: [],
      userAgent: "",
      screenWidth: 0,
      screenHeight: 0,
    }
  }

  Object.assign(session, info)
  saveSession(session)
}
