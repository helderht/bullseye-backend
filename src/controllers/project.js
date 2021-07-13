//imports
const Projects = require('../models/projects'),
  Estimates = require('../models/estimates'),
  SPsnapshots = require('../models/snapshots_sp'),
  md5 = require('md5'),
  {reg_act} = require('../utilities/help_activity'),
  {notify_team} = require('../utilities/help_notification'),
  {
    rmCollaborations,
    rmEstimates,
    rmActivities,
    rmNotifications,
    rmMessages,
    rmSnapshotFP,
    rmSnapshotSP,
    rmSnapshotUCP
  } = require('../utilities/help_remove')

module.exports = {
  add: async (req, res) => {
    try {
      const add = new Projects({
        name: req.body.name,
        description: req.body.description,
        id_category: req.body.category,
        id_user: req.info_user._id
      })
      key_access = Date.now().toString()
      add.key = md5(key_access)
      const added = await add.save()
      // registro de actividad
      reg_act('Crear proyecto', added._id, req.info_user._id)
      res.status(200).json({added, key_access})
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    try {
      const updated = await Projects.findByIdAndUpdate(req.body._id, req.body)
      if (updated) {
        // registro de actividad
        reg_act('Actualizar proyecto', updated._id, req.info_user._id)
        // notificar colaboradores
        notify_team(`Proyecto ${updated.name} actualizado`, updated._id)
        res.status(200).json(updated)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  remove: async (req, res) => {
    try {
      const removed = await Projects.findByIdAndDelete(req.params.idpro)
      if (removed) {
        const est = await Estimates.find({id_project: req.params.idpro})
        if (est) {
          for (const element of est) {
            if (element.way === 'sp') {
              const snapsp = await SPsnapshots.find({id_estimate: element._id})
              if (snapsp) {
                for (const elm of snapsp) {
                  await rmMessages(elm._id)
                }
              }
            }
            await rmSnapshotFP(element._id)
            await rmSnapshotSP(element._id)
            await rmSnapshotUCP(element._id)
          }
        }
        await rmEstimates(req.params.idpro)
        await rmCollaborations(req.params.idpro)
        await rmActivities(req.params.idpro)
        await rmNotifications(req.params.idpro)

        res.status(200).json(removed)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  all: async (req, res) => {
    try {
      const all = await Projects.find({id_user: req.info_user}).sort({_id: -1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  only: async (req, res) => {
    try {
      const one = await Projects.findById(req.params.idpro)
      if (one) res.status(200).json(one)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  key: async (req, res) => {
    try {
      const found = await Projects.findById(req.params.idpro)
      if (found) {
        const updateKey = Date.now().toString()
        await Projects.findByIdAndUpdate(req.params.idpro, {key: md5(updateKey)})
        res.status(200).json(updateKey)
      } else {
        res.status(404).json('Proyecto no encontrado')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
