const {Schema, model, ObjectId} = require('mongoose')

const EstimatesSchema = new Schema({
  name: {type: String, required: true},
  way: {type: String, required: true},
  createdIn: {type: String, default: Date.now},
  id_project: {type: ObjectId, required: true, ref: 'Projects'},
  id_owner: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Estimates', EstimatesSchema)
