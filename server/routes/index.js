const express = require('express')
const ctrl = require('../controllers/url.controller')

const apiRoutes = require('./api.route')

const router = express.Router()
router.get('/:id', ctrl.getOne)
router.use('/api', apiRoutes)

module.exports = router
