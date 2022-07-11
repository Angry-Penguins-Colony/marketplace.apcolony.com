import 'dotenv/config'

export const port = process.env.PORT || 3575;
export const workersCount = parseInt(process.env.WEB_CONCURRENCY ?? "1")
export const isInDevMode = process.env.NODE_ENV === 'development';