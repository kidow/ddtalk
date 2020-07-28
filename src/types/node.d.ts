declare namespace NodeJS {
  interface Process {
    env: ProcessEnv
  }
  interface ProcessEnv {
    REACT_APP_API_KEY: string
    REACT_APP_AUTH_DOMAIN: string
    REACT_APP_DATABASE_URL: string
    REACT_APP_PROJECT_ID: string
    REACT_APP_STORAGE_BUCKET: string
    REACT_APP_APP_ID: string
    REACT_APP_MEASUREMENT_ID: string
    REACT_APP_MESSAGING_SENDER_ID: string
    REACT_APP_ADMIN_ID: string
    REACT_APP_PASSWORD: string
    REACT_APP_GTM_ID: string
    REACT_APP_GIPHY_KEY: string
    REACT_APP_SENTRY_DSN: string
    REACT_APP_API_BASE_URL: string
  }
}
