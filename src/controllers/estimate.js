const Estimates = require('../models/estimates'),
  FPsnapshots = require('../models/snapshots_fp'),
  SPsnapshots = require('../models/snapshots_sp'),
  UCPsnapshots = require('../models/snapshots_ucp')

module.exports = {
  add: async (req, res) => {
    try {
      const addEst = new Estimates({
        name: req.body.name,
        way: req.body.way,
        id_project: req.body.id_project,
        id_owner: req.info_user._id
      })
      const addedEst = await addEst.save()
      switch (req.body.way) {
        case 'fp':
          const addFP = new FPsnapshots({
            branch: 'main',
            commit: 'Raiz',
            id_user: req.info_user._id,
            id_estimate: addedEst._id
          })
          const addedFP = await addFP.save()
          res.status(200).json({estimate: addedEst, snapshot: addedFP})
          break
        case 'sp':
          const addSP = new SPsnapshots({
            branch: 'main',
            commit: 'Raiz',
            id_user: req.info_user._id,
            id_estimate: addedEst._id
          })
          const addedSP = await addSP.save()
          res.status(200).json({estimate: addedEst, snapshot: addedSP})
          break
        case 'ucp':
          const addUCP = new UCPsnapshots({
            branch: 'main',
            commit: 'Raiz',
            id_user: req.info_user._id,
            id_estimate: addedEst._id
          })
          const addedUCP = await addUCP.save()
          res.status(200).json({estimate: addedEst, snapshot: addedUCP})
          break
        default:
          console.log('método de estimación invalido')
          res.status(404).json('método de estimación invalido')
      }
      // TODO: registrar actividad
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    res.send('update')
  },
  remove: async (req, res) => {
    res.send('remove')
  },
  all: async (req, res) => {
    try {
      const all = await Estimates.find({id_project: req.params.idpro})
        .sort({_id: -1})
        .populate('id_project', {name: 1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
