import type { FormErrors } from '~/types'

// Individual Validators
export const isRequired = (value: unknown, label = 'This field'): string | undefined => {
  if (value === null || value === undefined || value === '') {
    return `${label} is required`
  }
  return undefined
}

export const isEmail = (value: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Please enter a valid email address'
  return undefined
}

export const isPhone = (value: string): string | undefined => {
  const phoneRegex = /^\+?[\d\s\-().]{10,}$/
  if (!phoneRegex.test(value)) return 'Please enter a valid phone number'
  return undefined
}

export const isMinLength = (min: number) => (value: string): string | undefined => {
  if (value.length < min) return `Must be at least ${min} characters`
  return undefined
}

export const isMaxLength = (max: number) => (value: string): string | undefined => {
  if (value.length > max) return `Must be no more than ${max} characters`
  return undefined
}

export const isPasswordStrong = (value: string): string | undefined => {
  if (value.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
  return undefined
}

export const isMatch = (other: string, label = 'Passwords') => (value: string): string | undefined => {
  if (value !== other) return `${label} do not match`
  return undefined
}

export const isPositive = (value: number): string | undefined => {
  if (value <= 0) return 'Value must be positive'
  return undefined
}

export const isGpa = (value: number): string | undefined => {
  if (value < 0 || value > 4.0) return 'GPA must be between 0 and 4.0'
  return undefined
}

// Form Validator 
type ValidatorFn = (value: unknown) => string | undefined

export const validateField = (value: unknown, validators: ValidatorFn[]): string | undefined => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return undefined
}

export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, ValidatorFn[]>>
): FormErrors => {
  const errors: FormErrors = {}

  for (const [field, validators] of Object.entries(rules)) {
    if (!validators) continue
    const error = validateField(data[field], validators)
    if (error) errors[field] = error
  }

  return errors
}

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0
}
