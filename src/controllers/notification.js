const Notifications = require('../models/notifications')

module.exports = {
  remove: async (req, res) => {
    res.send('remove')
  },
  clean: async (req, res) => {
    res.send('clean')
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
