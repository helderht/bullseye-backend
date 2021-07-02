const Collaborations = require('../models/collaborations'),
  Projects = require('../models/projects'),
  md5 = require('md5')

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
            // TODO: registrar actividad
            // TODO: notificar al equipo
            res.status(200).json(added)
          }
        }
      }
      res.status(403).json('Código invalido')
    } catch (error) {
      res.status(500).send(error)
    }
  },
  remove: async (req, res) => {
    res.send('remove')
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
