// imports
const Categories = require('../models/categories'),
  mongoose = require('mongoose')

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
    try {
      const add = new Categories({
        name: req.body.name,
        id_user: req.info_user._id
      })
      const added = await add.save()
      res.status(200).json(added)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    try {
      const updated = await Categories.findByIdAndUpdate(req.body._id, req.body)
      if (updated) res.status(200).json(updated)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  remove: async (req, res) => {
    try {
      const removed = await Categories.findByIdAndDelete(req.params.idcat)
      if (removed) res.status(200).json(removed)
    } catch (error) {
      res.status(500).send(error)
    }
  },
  chart: async (req, res) => {
    try {
      const report = await Categories.aggregate([
        {$match: {id_user: mongoose.Types.ObjectId(req.info_user._id)}},
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: 'id_category',
            as: 'pro'
          }
        }
      ])
      res.status(200).json(report)
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
