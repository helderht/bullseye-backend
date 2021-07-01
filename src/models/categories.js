const {Schema, model, ObjectId} = require('mongoose')

const CategoriesSchema = new Schema({
  name: {type: String, required: true},
  id_user: {type: ObjectId, required: true, ref: 'Users'}
})

module.exports = model('Categories', CategoriesSchema)
