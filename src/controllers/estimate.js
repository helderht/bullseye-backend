const Estimates = require('../models/estimates'),
  FPsnapshots = require('../models/snapshots_fp'),
  SPsnapshots = require('../models/snapshots_sp'),
  UCPsnapshots = require('../models/snapshots_ucp'),
  {reg_act} = require('../utilities/help_activity'),
  {notify_team} = require('../utilities/help_notification')

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
      // registrar actividad
      reg_act('Crear estimación', addedEst.id_project, req.info_user._id)
      // notificar a equipo
      notify_team(`Estimación ${addedEst.name} creada`, addedEst.id_project)
      // crear snapshot raiz
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
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    try {
      const updated = await Estimates.findByIdAndUpdate(req.body._id, req.body)
      if (updated) {
        // registrar actividad
        reg_act('Renombrar Estimación', updated.id_project, req.info_user._id)
        notify_team(`Estimación ${updated.name} renombrado`, updated.id_project)
        res.status(200).json(updated)
      }
    } catch (error) {
      res.status(500).send(error)
    }
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
