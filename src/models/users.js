const {Schema, model} = require('mongoose'),
  bcrypt = require('bcryptjs')

const UsersSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  img: {type: String, default: 'cover.png'},
  createdIn: {type: Date, default: Date.now},
  recovery: {type: Number}
})

UsersSchema.methods.encode = async password => {
  const salt = await bcrypt.genSalt(8)
  const hash = await bcrypt.hash(password, salt)
  return hash
}
UsersSchema.methods.verify = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = model('Users', UsersSchema)
