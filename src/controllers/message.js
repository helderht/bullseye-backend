const Messages = require('../models/messages')

module.exports = {
  add: async (req, res) => {
    try {
      const add = new Messages(req.body)
      add.id_user = req.info_user._id
      const added = await add.save()
      res.status(200).json(added)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  all: async (req, res) => {
    try {
      const all = await Messages.find({id_snapshot: req.params.idshot}).populate('id_user', {
        name: 1,
        img: 1
      })
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
