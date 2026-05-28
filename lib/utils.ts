import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export const SUBJECTS = ["Matemática", "Lenguaje", "Ciencias", "Inglés"] as const
export type Subject = typeof SUBJECTS[number]

export const GRADE_LEVELS = ["1° Medio", "2° Medio", "3° Medio", "4° Medio", "PAES"] as const
export type GradeLevel = typeof GRADE_LEVELS[number]

export const SUBSCRIPTION_PLANS = {
  MONTHLY: { label: "Mensual", price: 9990, months: 1 },
  QUARTERLY: { label: "Trimestral", price: 24990, months: 3 },
  ANNUAL: { label: "Anual", price: 79990, months: 12 },
} as const
