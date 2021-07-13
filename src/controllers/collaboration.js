const Collaborations = require('../models/collaborations'),
  Projects = require('../models/projects'),
  md5 = require('md5'),
  {reg_act} = require('../utilities/help_activity'),
  {notify_col, notify_owner, notify_team} = require('../utilities/help_notification')

module.exports = {
  add: async (req, res) => {
    try {
      const access_key = md5(req.body.key),
        found = await Projects.findOne({key: access_key})
      if (found) {
        // verificar el propietario
        if (req.info_user._id.toString() === found.id_user.toString()) {
          res
            .status(200)
            .json({tag: 'war', msg: 'Acción invalida, eres el propietario del proyecto'})
        } else {
          // verificar integrantes
          const membership = await Collaborations.findOne({
            id_project: found._id,
            id_user: req.info_user._id
          })
          if (membership) {
            res
              .status(200)
              .json({tag: 'war', msg: 'Acción invalida, eres colaborador del proyecto'})
          } else {
            const add = new Collaborations({id_project: found._id, id_user: req.info_user._id})
            const added = await add.save()
            // registrar actividad
            reg_act('Unirse a proyecto', found._id, req.info_user._id)
            // notificar al propietario
            notify_owner(`Colaborador nuevo en ${found.name}`, found._id, found.id_user)
            // notificar colaboradores
            notify_col(`Colaborador nuevo en ${found.name}`, found._id, req.info_user._id)
            res.status(200).json(added)
          }
        }
      } else {
        res.status(403).json('Código invalido')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  remove: async (req, res) => {
    try {
      const removed = await Collaborations.findByIdAndDelete(req.params.idcol)
        .populate('id_user')
        .populate('id_project')
      if (removed) {
        // registrar actividad
        reg_act('Abandonar proyecto', removed.id_project._id, removed.id_user._id)
        // notificar al team
        if (removed.id_user._id.toString() === req.info_user._id.toString()) {
          console.log('notificar al owner')
          notify_owner(
            `${removed.id_user.name} abandono el proyecto ${removed.id_project.name}`,
            removed.id_project._id,
            removed.id_project.id_user
          )
          notify_col(
            `${removed.id_user.name} abandono el proyecto ${removed.id_project.name}`,
            removed.id_project._id,
            req.info_user._id
          )
        } else {
          console.log('notificar al equipo')
          notify_team(
            `${removed.id_user.name} abandono el proyecto ${removed.id_project.name}`,
            removed.id_project._id
          )
        }
        res.status(200).json(removed)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  all: async (req, res) => {
    try {
      const all = await Collaborations.find({id_user: req.info_user._id})
        .sort({_id: -1})
        .populate('id_project')
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  team: async (req, res) => {
    try {
      const team = await Collaborations.find({id_project: req.params.idpro}).populate('id_user', {
        name: 1,
        email: 1,
        img: 1
      })
      if (team) res.status(200).json(team)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
