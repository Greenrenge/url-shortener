const express = require('express')
const ctrl = require('../controllers/url.controller')
const router = express.Router()
const { breaker } = require('./cacher')
const { enhanceHandler } = require('../helpers/cache')
router.post('/', (req, res, next) => {
    req.cacheBreak = breaker
    next()
}, enhanceHandler(ctrl.createOne, {
    keys: ['body'],
    namespace: 'url_save',
    ignoreStatusCodes: [500, 404],
    ttl: 30 * 24 * 60 * 60 * 1000//30d
}))

module.exports = router
