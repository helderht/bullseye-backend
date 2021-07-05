const Activities = require('../models/activities')

module.exports = {
  all: async (req, res) => {
    try {
      const all = await Activities.find({id_project: req.params.idpro}).populate('id_user')
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
