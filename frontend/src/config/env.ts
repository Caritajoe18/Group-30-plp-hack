// Environment configuration for Talk Safe
// All environment variables with VITE_ prefix are exposed to the client

export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',

  // App Information
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Talk Safe',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Emergency Contact Numbers
  EMERGENCY_NUMBER: import.meta.env.VITE_EMERGENCY_NUMBER || '911',
  POLICE_NUMBER: import.meta.env.VITE_POLICE_NUMBER || '911',
  MEDICAL_NUMBER: import.meta.env.VITE_MEDICAL_NUMBER || '911',

  // Feature Flags
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE !== 'false', // Default true
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA !== 'false', // Default true
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true', // Default false

  // Security Settings
  EVIDENCE_VAULT_PIN: import.meta.env.VITE_EVIDENCE_VAULT_PIN || '1234',
  SESSION_TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour in ms

  // External Services
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID || '',

  // Development helpers
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

// Type-safe environment variables
export type Config = typeof config

// Helper function to get environment info
export const getEnvInfo = () => ({
  environment: config.isDevelopment ? 'development' : 'production',
  apiUrl: config.API_BASE_URL,
  version: config.APP_VERSION,
})

// Validate critical configuration
export const validateConfig = () => {
  const requiredVars = ['API_BASE_URL']
  const missing = requiredVars.filter(key => !config[key as keyof typeof config])

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    console.warn('Using default values. Check .env.example for required variables.')
  }

  return {
    isValid: missing.length === 0,
    missingVars: missing,
  }
}