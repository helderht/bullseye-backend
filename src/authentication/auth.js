// imports
const token = require('./token')

module.exports = {
  verify_user: async (req, res, next) => {
    if (!req.headers.token) {
      return res.status(404)
    }
    const tkn = await token.decode(req.headers.token)
    if (tkn) {
      req.info_user = {_id: tkn._id, email: tkn.email, name: tkn.name}
      next()
    } else {
      return res.status(403)
    }
  }
}
