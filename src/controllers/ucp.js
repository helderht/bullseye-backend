const UCPsnapshots = require('../models/snapshots_ucp'),
  Estimates = require('../models/estimates'),
  {reg_act} = require('../utilities/help_activity'),
  {notify_owner, notify_team, notify_col} = require('../utilities/help_notification')

module.exports = {
  add: async (req, res) => {
    try {
      const add = new UCPsnapshots(req.body)
      add.id_user = req.info_user._id
      const added = await add.save()
      // registrar actividad
      const estimate = await Estimates.findById(added.id_estimate)
      if (estimate) {
        reg_act('Crear snapshot P. casos de uso', estimate.id_project, req.info_user._id)
        if (req.info_user._id.toString() === estimate.id_owner.toString()) {
          notify_team(`Snapshot agregado en ${estimate.name}`, estimate.id_project)
        } else {
          notify_owner(
            `Snapshot agregado en ${estimate.name}`,
            estimate.id_project,
            estimate.id_owner
          )
          notify_col(
            `Snapshot agregado en ${estimate.name}`,
            estimate.id_project,
            req.info_user._id
          )
        }
        res.status(200).json(added)
      } else {
        res.status(404).json('Estimacion no existe')
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
      const all = await UCPsnapshots.find({id_estimate: req.params.idest}).sort({id: -1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(200).send(error)
    }
  },
  only: async (req, res) => {
    try {
      const only = await UCPsnapshots.findById(req.params.idshot).populate('id_estimate')
      if (only) res.status(200).json(only)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
