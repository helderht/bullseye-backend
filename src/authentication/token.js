// imports
const jwt = require('jsonwebtoken'),
  Users = require('../models/users')

module.exports = {
  encode: async (_id, email, name, img) => {
    const tkn = jwt.sign({_id, email, name, img}, process.env.SECRET_KEY, {
      expiresIn: '1d'
    })
    return tkn
  },
  decode: async tkn => {
    try {
      const {_id} = await jwt.verify(tkn, process.env.SECRET_KEY)
      const user = await Users.findById(_id)
      if (user) {
        return user
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
}
