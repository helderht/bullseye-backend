// imports
const router = require('express').Router(),
  auth = require('../authentication/auth')

const home = require('./home'),
  project = require('./project'),
  collaboration = require('./collaboration'),
  estimate = require('./estimate'),
  fp = require('./fp'),
  sp = require('./sp'),
  ucp = require('./ucp'),
  activity = require('./activity'),
  notification = require('./notification'),
  category = require('./category')

// home
router.post('/signup', home.signup)
router.post('/signin', home.signin)
// projects
router.post('/proadd', auth.verify_user, project.add)
router.post('/proupdate', auth.verify_user, project.update)
router.delete('/proremove/:idpro', auth.verify_user, project.remove)
router.get('/proall', auth.verify_user, project.all)
router.get('/proonly/:idpro', auth.verify_user, project.only)
router.get('/prokey/:idpro', auth.verify_user, project.key)
// collaborations
router.post('/coladd', auth.verify_user, collaboration.add)
router.delete('/colremove/:idcol', auth.verify_user, collaboration.remove)
router.get('/colall', auth.verify_user, collaboration.all)
router.get('/colteam/:idpro', auth.verify_user, collaboration.team)
// estimates
router.post('/estadd', auth.verify_user, estimate.add)
router.post('/estupdate', auth.verify_user, estimate.update)
router.delete('/estremove/:idest', auth.verify_user, estimate.remove)
router.get('/estall/:idpro', auth.verify_user, estimate.all)
// function points
router.post('/fpadd', auth.verify_user, fp.add)
router.delete('/fpremove/:idshot', auth.verify_user, fp.remove)
router.get('/fpall/:idest', auth.verify_user, fp.all)
router.get('/fponly/:idshot', auth.verify_user, fp.only)
// story points
router.post('/spupdate', auth.verify_user, sp.update)
router.delete('/spremove/:idshot', auth.verify_user, sp.remove)
router.get('/spall/:idest', auth.verify_user, sp.all)
router.get('/sponly/:idshot', auth.verify_user, sp.only)
// use case points
router.post('/ucpadd', auth.verify_user, ucp.add)
router.delete('/ucpremove/:idshot', auth.verify_user, ucp.remove)
router.get('/ucpall/:idest', auth.verify_user, ucp.all)
router.get('/ucponly/:idshot', auth.verify_user, ucp.only)
// activities
router.get('/actall/:idpro', auth.verify_user, activity.all)
// notifications
router.delete('/notremove/:idnot', auth.verify_user, notification.remove)
router.post('/notclean/:idpro', auth.verify_user, notification.clean)
router.get('/notall', auth.verify_user, notification.all)
// categories
router.post('/catadd', auth.verify_user, category.add)
router.post('/catupdate', auth.verify_user, category.update)
router.delete('/catremove', auth.verify_user, category.remove)
router.get('/catall', auth.verify_user, category.all)
router.get('/catchart', auth.verify_user, category.chart)

module.exports = router
