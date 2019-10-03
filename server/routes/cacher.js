
const { getEnhancerWithBreaker } = require('../helpers/cache')
const { breaker, handlerEnhancer } = getEnhancerWithBreaker({
    key: req => req.params.id,
    namespace: 'url',
    ignoreStatusCodes: [500],
    ttl: 30 * 24 * 60 * 60 * 1000// 30d
})
module.exports = {
    breaker,
    handlerEnhancer
}