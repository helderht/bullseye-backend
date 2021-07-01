// imports
const router = require('express').Router(),
  auth = require('../authentication/auth')

const home = require('./home'),
  project = require('./project'),
  category = require('./category')

// home
router.post('/signup', home.signup)
router.post('/signin', home.signin)
router.post('/refresh', home.refresh)
// projects
router.post('/proadd', auth.verify_user, project.add)
router.post('/proupdate', auth.verify_user, project.update)
router.delete('/proremove', auth.verify_user, project.remove)
router.get('/proall', auth.verify_user, project.all)
router.get('/proonly/:idpro', auth.verify_user, project.only)
router.get('/prokey/:idpro', auth.verify_user, project.key)
// categories
router.post('/catadd', auth.verify_user, category.add)
router.post('/catupdate', auth.verify_user, category.update)
router.delete('/catremove', auth.verify_user, category.remove)
router.get('/catall', auth.verify_user, category.all)
router.get('/catchart', auth.verify_user, category.chart)

module.exports = router
