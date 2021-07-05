const {Schema, model, ObjectId} = require('mongoose')

const ActivitiesSchema = new Schema({
  operation: {type: String, required: true},
  registeredIn: {type: Date, default: Date.now},
  id_project: {type: ObjectId, required: true, ref: 'Projects'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Activities', ActivitiesSchema)
