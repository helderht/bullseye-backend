const UCPsnapshots = require('../models/snapshots_ucp')

module.exports = {
  update: async (req, res) => {
    res.send('update')
  },
  remove: async (req, res) => {
    res.send('remove')
  },
  all: async (req, res) => {
    try {
      const all = await UCPsnapshots.find({id_estimate: req.params.idest}).sort({id: -1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(200).send(error)
    }
  },
  only: async (req, res) => {
    res.send('only')
  }
}
