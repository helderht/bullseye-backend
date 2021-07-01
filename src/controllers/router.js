// imports
const router = require('express').Router()

const home = require('./home')

router.post('/signup', home.signup)
router.post('/signin', home.signin)
router.post('/refresh', home.refresh)

module.exports = router
