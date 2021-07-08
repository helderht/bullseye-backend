const {Schema, model, ObjectId} = require('mongoose')

const UCPsnapshotsSchema = new Schema({
  actors: {
    type: Array,
    default: [
      {weight: 1, amount: 0},
      {weight: 2, amount: 0},
      {weight: 3, amount: 0}
    ]
  },
  cases: {
    type: Array,
    default: [
      {weight: 1, amount: 0},
      {weight: 2, amount: 0},
      {weight: 3, amount: 0}
    ]
  },
  technical: {
    type: Array,
    default: [
      {weight: 2, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 0.5, pts: 0},
      {weight: 0.5, pts: 0},
      {weight: 2, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0},
      {weight: 1, pts: 0}
    ]
  },
  enviroment: {
    type: Array,
    default: [
      {weight: 1.5, pts: 0},
      {weight: 0.5, pts: 0},
      {weight: 1, pts: 0},
      {weight: 0.5, pts: 0},
      {weight: 1, pts: 0},
      {weight: 2, pts: 0},
      {weight: -1, pts: 0},
      {weight: -1, pts: 0}
    ]
  },
  params: {type: Object, default: {hours: 1, days: 1, pays: 0}},
  aprox: {type: Object, default: {time: 0, cost: 0, team: 1, productivity: 20, effort: 0}},
  others: {type: Array},
  commit: {type: String, required: true},
  branch: {type: String, required: true},
  modifiedIn: {type: Date, default: Date.now},
  id_estimate: {type: ObjectId, required: true, ref: 'Estimates'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('UCPsnapshots', UCPsnapshotsSchema)
