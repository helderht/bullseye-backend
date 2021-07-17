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
        reg_act('Crear Snapshot P. Función', estimate.id_project, req.info_user._id)
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
    try {
      const removed = await FPsnapshots.findByIdAndDelete(req.params.idshot)
      if (removed) {
        // registrar actividad
        const estimate = await Estimates.findById(removed.id_estimate)
        if (estimate) {
          reg_act('Eliminar snapshot P. Función', estimate.id_project, req.info_user._id)
          if (req.info_user._id.toString() === estimate.id_owner.toString()) {
            notify_team(
              `Snapshot ${removed._id} eliminado en ${estimate.name}`,
              estimate.id_project
            )
          } else {
            notify_owner(
              `Snapshot ${removed._id} eliminado en ${estimate.name}`,
              estimate.id_project,
              estimate.id_owner
            )
            notify_col(
              `Snapshot ${removed._id} eliminado en ${estimate.name}`,
              estimate.id_project,
              req.info_user._id
            )
          }
        }
        res.status(200).json(removed)
      }
    } catch (error) {
      res.status(500).send(error)
    }
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
  },
  last: async (req, res) => {
    try {
      const last = await FPsnapshots.find({id_user: req.info_user._id})
        .sort({$natural: -1})
        .populate('id_estimate')
        .limit(1)
      if (last) res.status(200).json(last)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
