const KeyV = require('keyv')
const jsum = require('jsum')
const { get, set } = require('lodash')

const _cacheEngine = (() => {
    const kv = new KeyV()
    return {
        set: (k, v, ttl) => kv.set(k, v, ttl), // no TTL ,forever
        get: k => kv.get(k),
        del: k => kv.delete(k)
    }
})()

//beware of cookie or session that need to keep for specific user

//.end() .json .status .send .redirect
const createProxy = (res) => {
    let replay = []//make trap of using res object (only method)
    const handler = {
        get: (obj, prop) => {
            let ori = obj[prop]
            if (typeof ori !== 'function') {
                return obj[prop]
            }
            //make it chain-able
            return (...args) => {
                replay.push({ method: prop, args })
                ori = ori.bind(obj)
                const res = ori(...args)
                return res ? new Proxy(res, handler) : res //if redirect, it return undefined
            }
        }
    }
    return {
        res: new Proxy(res, handler),
        getReplay: () => replay
    }
}
// @TODO : TTL per statuscode returned , 404 ttl might be 1 min

// @TODO : HOW TO Un-cache

//body, query, params
module.exports = {
    //BREAKER OF EACH COMBINATION KEYS
    // receive as func to find a key , breaker provide the
    enhanceHandler: (handler, { keys = ['body'], ignoreStatusCodes = [404, 500], ttl, namespace = '', cacheEngine = _cacheEngine }) => {
        return async (req, expressRes, next) => {
            try {
                const cacheKey = namespace + '_' + jsum.digest({
                    ...keys.map(p => ({ [p]: get(req, p) })).reduce((p, c) => ({ ...p, ...c }), {})
                }, 'SHA256', 'base64')
                const cacheVal = await cacheEngine.get(cacheKey)//{replay:[]}
                if (cacheVal && !req.header('Express-Cache-Bypass')) {
                    expressRes.append('Express-Cache', `STATUS=HIT;TTL=${ttl || 0}`)
                    const { replay } = cacheVal
                    for (const { method, args } of replay) {
                        expressRes[method](...args)
                    }
                    return
                }
                const { res, getReplay } = createProxy(expressRes)
                await handler(req, res, next)
                //trap-able
                //cache back to store if res.code not in the nonCache list
                if (!ignoreStatusCodes.includes(res.statusCode)) {
                    cacheEngine.set(cacheKey, { replay: getReplay() }, ttl)
                }
            } catch (err) {
                //cannot trap anymore
                next(err)
            }
        }
    },
    getEnhancerWithBreaker: ({ key = req => req.body, ignoreStatusCodes = [404, 500], ttl, namespace = '', cacheEngine = _cacheEngine }) => {
        const getCacheKey = (obj) => namespace + '_' + jsum.digest({
            obj
        }, 'SHA256', 'base64')
        return {
            breaker: async (key) => {
                const cacheKey = getCacheKey(key)
                await cacheEngine.del(cacheKey)
            },
            handlerEnhancer: handler => async (req, expressRes, next) => {
                try {
                    const cacheKey = getCacheKey(key(req))
                    const cacheVal = await cacheEngine.get(cacheKey)
                    if (cacheVal && !req.header('Express-Cache-Bypass')) {
                        expressRes.append('Express-Cache', `STATUS=HIT;TTL=${ttl || 0}`)
                        const { replay } = cacheVal
                        for (const { method, args } of replay) {
                            expressRes[method](...args)
                        }
                        return
                    }
                    const { res, getReplay } = createProxy(expressRes)
                    await handler(req, res, next)
                    //trap-able
                    //cache back to store if res.code not in the nonCache list
                    if (!ignoreStatusCodes.includes(res.statusCode)) {
                        cacheEngine.set(cacheKey, { replay: getReplay() }, ttl)
                    }
                } catch (err) {
                    //cannot trap anymore
                    next(err)
                }
            }

        }
    }
}
