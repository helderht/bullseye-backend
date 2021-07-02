const {Schema, model, ObjectId} = require('mongoose')

const CollaborationsSchema = new Schema({
  createdIn: {type: Date, default: Date.now},
  id_project: {type: ObjectId, required: true, ref: 'Projects'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Collaborations', CollaborationsSchema)
