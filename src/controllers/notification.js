const Notifications = require('../models/notifications')

module.exports = {
  clean: async (req, res) => {
    try {
      const removed = await Notifications.deleteMany({id_user: req.info_user._id})
      if (removed) res.status(200).json(removed)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  all: async (req, res) => {
    try {
      const all = await Notifications.find({id_user: req.info_user._id})
        .sort({_id: -1})
        .populate('id_user', {name: 1, img: 1})
      if (all) res.status(200).json(all)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
