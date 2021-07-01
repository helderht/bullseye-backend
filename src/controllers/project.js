//imports
const Projects = require('../models/projects'),
  md5 = require('md5')

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
      // TODO: registrar la actividad
      res.status(200).json({added, key_access})
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    // console.log(req.body)
    try {
      const updated = await Projects.findByIdAndUpdate(req.body._id, req.body)
      if (updated) {
        // registrar la actividad
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
