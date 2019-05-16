const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

module.exports = withTypescript(withSass({
  env: {
    HOSTNAME     : process.env.HOSTNAME,
    HTTPS_ENABLED: process.env.HTTPS_ENABLED,
    DEVELOPMENT  : process.env.DEVELOPMENT
  }
}))
