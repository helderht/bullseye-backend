// imports
const Categories = require('../models/categories')

module.exports = {
  all: async (req, res) => {
    try {
      const list = await Categories.find({id_user: req.info_user._id}).sort({
        _id: -1
      })
      if (list) {
        res.status(200).json(list)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  add: async (req, res) => {
    res.send('add')
  },
  update: async (req, res) => {
    res.send('update')
  },
  remove: async (req, res) => {
    res.send('remove')
  },
  chart: async (req, res) => {
    res.send('chart')
  }
}
