// imports
const router = require('express').Router()

const home = require('./home')

router.post('/signin', home.signin)

module.exports = router
