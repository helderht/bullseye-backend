const {Schema, model, ObjectId} = require('mongoose')

const MessagesSchema = new Schema({
  message: {type: String},
  createdIn: {type: Date, default: Date.now},
  id_snapshot: {type: ObjectId, required: true, ref: 'SnapshotSP'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Messages', MessagesSchema)
