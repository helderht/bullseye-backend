const {Schema, model, ObjectId} = require('mongoose')

const FPsnapshotsSchema = new Schema({
  requirements: {type: Array},
  factors: {
    type: Array,
    default: [
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0},
      {pts: 0}
    ]
  },
  params: {type: Object, default: {hours: 1, days: 1, pays: 0}},
  aprox: {type: Object, default: {time: 0, cost: 0, team: 1, productivity: 8, effort: 0}},
  others: {type: Array},
  commit: {type: String, required: true},
  branch: {type: String, required: true},
  modifiedIn: {type: Date, default: Date.now},
  id_estimate: {type: ObjectId, required: true, ref: 'Estimates'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('FPsnapshoots', FPsnapshotsSchema)
