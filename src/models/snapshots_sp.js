const {Schema, model, ObjectId} = require('mongoose')

const SPsnapshotsSchema = new Schema({
  pivot: {type: Object, default: {detail: 'Elige la historia de referencia', pts: 0}},
  stories: {type: Array},
  params: {type: Object, default: {hours: 1, days: 1, sprint: 1, pays: 0}},
  aprox: {type: Object, default: {time: 0, cost: 0, team: 1, velocity: 1}},
  others: {type: Array},
  commit: {type: String, required: true},
  branch: {type: String, required: true},
  modifiedIn: {type: Date, default: Date.now},
  id_estimate: {type: ObjectId, reuired: true, ref: 'Estimates'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('SPsnapshots', SPsnapshotsSchema)
