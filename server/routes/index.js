const express = require('express')
const ctrl = require('../controllers/url.controller')
const apiRoutes = require('./api.route')
const { handlerEnhancer } = require('./cacher.js')

const router = express.Router()
router.get('/:id', handlerEnhancer(ctrl.getOne))
router.use('/api', apiRoutes)

module.exports = router
