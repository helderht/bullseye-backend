const FPsnapshots = require('../models/snapshots_fp'),
  Estimates = require('../models/estimates'),
  {reg_act} = require('../utilities/help_activity'),
  {notify_owner, notify_team, notify_col} = require('../utilities/help_notification')

module.exports = {
  add: async (req, res) => {
    try {
      const add = new FPsnapshots(req.body)
      add.id_user = req.info_user._id
      const added = await add.save()
      // registrar actividad
      const estimate = await Estimates.findById(added.id_estimate)
      if (estimate) {
        reg_act('Crear Snapshot', estimate.id_project, req.info_user._id)
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
        res.status(404).json('Estimación no existe')
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
      const all = await FPsnapshots.find({id_estimate: req.params.idest}).sort({_id: -1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  only: async (req, res) => {
    try {
      const one = await FPsnapshots.findById(req.params.idshot).populate('id_estimate')
      if (one) res.status(200).json(one)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
