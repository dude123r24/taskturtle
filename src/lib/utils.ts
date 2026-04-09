import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EisenhowerQuadrant, TaskHorizon } from "@/store/taskStore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface QuadrantMeta {
  label: string
  color: string
  icon: string
}

/** Eisenhower quadrants + backlog: labels, accent color, and short icon for UI chips. */
export const QUADRANT_LABELS: Record<EisenhowerQuadrant, QuadrantMeta> = {
  DO_FIRST: { label: "Do first", color: "#E53935", icon: "" },
  SCHEDULE: { label: "Schedule", color: "#1E88E5", icon: "" },
  DELEGATE: { label: "Delegate", color: "#FB8C00", icon: "" },
  ELIMINATE: { label: "Eliminate", color: "#757575", icon: "" },
  UNASSIGNED: { label: "Backlog", color: "#9E9E9E", icon: "" },
}

export const HORIZON_LABELS: Record<TaskHorizon, string> = {
  SHORT_TERM: "Short term",
  LONG_TERM: "Long term",
}

export function formatMinutes(minutes: number | undefined | null): string {
  if (minutes == null || !Number.isFinite(minutes)) return "—"
  const m = Math.round(minutes)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h}h ${rest}m` : `${h}h`
}
