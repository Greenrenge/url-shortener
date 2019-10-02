const express = require('express')
const ctrl = require('../controllers/url.controller')
const router = express.Router()
router.post('/', ctrl.createOne)

module.exports = router
