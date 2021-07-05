const {Schema, model, ObjectId} = require('mongoose')

const NotificationsSchema = new Schema({
  message: {type: String, required: true},
  notifiedIn: {type: Date, default: Date.now},
  id_project: {type: ObjectId, required: true, ref: 'Projects'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Notifications', NotificationsSchema)
