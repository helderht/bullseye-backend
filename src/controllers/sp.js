const SPsnapshots = require('../models/snapshots_sp')

module.exports = {
  update: async (req, res) => {
    res.send('update')
  },
  remove: async (req, res) => {
    res.send('remove')
  },
  all: async (req, res) => {
    try {
      const all = await SPsnapshots.find({id_estimate: req.params.idest}).sort({id: -1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  only: async (req, res) => {
    res.send('only')
  }
}
