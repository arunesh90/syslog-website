// List of constants that could be used by multiple scripts

export const hostname = process.env.HOSTNAME     || 'localhost'
export const protocol = process.env.HTTPS_ENABLED ? 'https://' : 'http'
export const env      = process.env.DEVELOPMENT   ? 'development' : 'production'
