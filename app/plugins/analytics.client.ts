"use client"

import { defineNuxtPlugin, useRouter, onNuxtReady } from "#app"
import { $fetch } from "ofetch"

export default defineNuxtPlugin((nuxtApp) => {
  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("analytics-session-id")
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("analytics-session-id", sessionId)
    }
    return sessionId
  }

  const sessionId = getSessionId()

  // Send session info on first load
  const sendSessionInfo = async () => {
    try {
      await $fetch("/api/analytics/track", {
        method: "POST",
        body: {
          sessionId,
          eventType: "sessionStart",
          eventData: { startTime: Date.now() },
          userAgent: navigator.userAgent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        },
      })
    } catch (error) {
      console.error("[Analytics] Failed to send session info:", error)
    }
  }

  // Track click events
  const trackClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const targetInfo = {
      tagName: target.tagName,
      id: target.id,
      className: target.className,
      text: target.textContent?.substring(0, 50) || "",
    }

    try {
      await $fetch("/api/analytics/track", {
        method: "POST",
        body: {
          sessionId,
          eventType: "click",
          eventData: {
            x: event.clientX,
            y: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            target: targetInfo,
            page: window.location.pathname,
            timestamp: Date.now(),
          },
        },
      })
    } catch (error) {
      console.error("[Analytics] Failed to track click:", error)
    }
  }

  // Track page views
  const trackPageView = async (page: string, referrer = "") => {
    try {
      await $fetch("/api/analytics/track", {
        method: "POST",
        body: {
          sessionId,
          eventType: "pageView",
          eventData: {
            page,
            referrer,
            timestamp: Date.now(),
            url: window.location.href,
          },
        },
      })
    } catch (error) {
      console.error("[Analytics] Failed to track page view:", error)
    }
  }

  // Initialize
  const router = useRouter()

  // Send session info and track initial page view
  onNuxtReady(() => {
    sendSessionInfo()
    trackPageView(router.currentRoute.value.path, document.referrer)
  })

  // Add click listener
  if (process.client) {
    document.addEventListener("click", trackClick)
  }

  // Track route changes
  router.afterEach((to, from) => {
    trackPageView(to.path, from.path)
  })

  // Provide analytics helper
  return {
    provide: {
      analytics: {
        sessionId,
        trackCustomEvent: async (eventName: string, data: any) => {
          try {
            await $fetch("/api/analytics/track", {
              method: "POST",
              body: {
                sessionId,
                eventType: "customEvent",
                eventData: {
                  eventName,
                  data,
                  timestamp: Date.now(),
                },
              },
            })
          } catch (error) {
            console.error("[Analytics] Failed to track custom event:", error)
          }
        },
      },
    },
  }
})
