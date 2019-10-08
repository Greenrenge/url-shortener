const UrlModel = require('../models/url.model')
const IdModel = require('../models/identifier.model')
const base62 = require('base62')
const config = require('../config/env')
const rp = require('request-promise')
const PREFIX = config.prefix.endsWith('/') ? config.prefix.split('/').filter((_, i, arr) => i !== arr.length - 1).join('/') : config.prefix

const timeOut = ms => new Promise((resolve, reject) => {
    setTimeout(reject, ms)
})
const isIdValid = id => id

const tryRequest = async uri => {
    const response = await rp({
        uri,
        method: 'GET',
        resolveWithFullResponse: true
    })

    return /^2/.test('' + response.statusCode)
}

const taskTimeout = sec => task => async () => {
    await Promise.race([
        timeOut(sec),
        task()
    ])
}

const isLinkValid = async function (link = '') {
    let tryList = []
    if (link.startsWith('http')) {
        tryList.push(link)
    } else {
        tryList.push(`https://${link}`)
        tryList.push(`https://${link}`)
    }
}
async function getOne(req, res, next) {
    try {
        const id = req.params.id
        if (isIdValid(id)) {
            const url = await UrlModel.findOne({ _id: `${id}` })
            if (url) {
                return res.redirect(url.full_link.startsWith('http') ? url.full_link : `http://${url.full_link}`)
            }
        }
        return res.status(404).send('The link you are looking for is not found in the system')
    } catch (err) {
        console.error(`error to get url in database `, err.toString())
        next(err)
    }
}

async function createOne(req, res, next) {
    try {

        const { link } = req.body
        let doc = await UrlModel.findOne({ full_link: link })
        if (!doc) {
            const latestId = await IdModel.getIncrementNumber('url_shorten')
            const newUrl = new UrlModel({ _id: base62.encode(latestId), full_link: link })
            doc = await newUrl.save()
            //destroy cache
            await req.cacheBreak(doc._id)
        }

        return res.json({ shorten_url: `${PREFIX}/${doc._id}` })

    } catch (err) {
        console.error(`error to create new url in database `, err.toString())
        next(err)
    }
}

module.exports = {
    createOne,
    getOne
}