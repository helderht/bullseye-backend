const Estimates = require('../models/estimates')

module.exports = {
  add: async (req, res) => {
    try {
      const add = new Estimates({
        name: req.body.name,
        way: req.body.way,
        id_project: req.body.id_project,
        id_owner: req.info_user._id
      })
      const added = await add.save()
      // TODO: registrar actividad
      res.status(200).json(added)
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
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
