const {Schema, model, ObjectId} = require('mongoose')

const UCPsnapshotsSchema = new Schema({
  actors: {type: Array},
  cases: {type: Array},
  technical: {type: Array},
  enviroment: {type: Array},
  params: {type: Object},
  aprox: {type: Object},
  otros: {type: Array},
  commit: {type: String, required: true},
  branch: {type: String, required: true},
  modifiedIn: {type: Date, default: Date.now},
  id_estimate: {type: ObjectId, required: true, ref: 'Estimates'},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('UCPsnapshots', UCPsnapshotsSchema)
