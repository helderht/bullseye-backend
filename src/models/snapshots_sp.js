const {Schema, model, ObjectId} = require('mongoose')

const SPsnapshotsSchema = new Schema({
  pivot: {type: Object},
  stories: {type: Array},
  params: {type: Object},
  aprox: {type: Object},
  otros: {type: Array},
  commit: {type: String, required: true},
  branch: {type: String, required: true},
  modifiedIn: {type: Date, default: Date.now},
  id_estimate: {type: ObjectId, reuired: true, ref: 'Estimates'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('SPsnapshots', SPsnapshotsSchema)
