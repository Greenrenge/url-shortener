const APP_URL = process.env.URL.endsWith('/') ? process.env.URL.split('/').filter((_, i, arr) => i !== arr.length - 1).join('/') : process.env.URL

module.exports = {
    APP_URL
}