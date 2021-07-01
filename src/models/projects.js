const {Schema, model, ObjectId} = require('mongoose')

const ProjectsSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  key: {type: String, required: true},
  createdIn: {type: Date, default: Date.now()},
  id_user: {type: ObjectId, required: true, ref: 'Users'},
  id_category: {type: ObjectId, required: true, ref: 'Categories'}
})

module.exports = model('Projects', ProjectsSchema)
