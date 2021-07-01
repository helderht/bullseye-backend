//imports
const Users = require('../models/users'),
  Categories = require('../models/categories'),
  token = require('../authentication/token'),
  jwt = require('jsonwebtoken')

module.exports = {
  signup: async (req, res) => {
    try {
      const user = await Users.findOne({email: req.body.email})
      if (user) {
        res.status(200).json({tag: 'inf', msg: 'Email en uso'})
      } else {
        const add = new Users(req.body)
        add.password = await add.encode(req.body.password)
        const added = await add.save()
        // categoria por default
        const cat = new Categories({name: 'Web', id_user: added._id})
        await cat.save()
        res
          .status(200)
          .json({tag: 'suc', msg: 'Felicidades eres nuevo usuario'})
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  signin: async (req, res) => {
    try {
      const user = await Users.findOne({email: req.body.email})
      if (user) {
        const match = await user.verify(req.body.password)
        if (match) {
          // enviar token
          let token_user = await token.encode(
            user._id,
            user.email,
            user.name,
            user.img
          )
          res.status(200).json(token_user)
        } else {
          res.status(403).json({msg: 'Contraseña incorrecta'})
        }
      } else {
        res.status(403).json({msg: 'Email no encontrado'})
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  refresh: async (req, res) => {
    try {
      let id_usr = null
      try {
        const {_id} = await jwt.decode(req.body.token)
        id_usr = _id
      } catch (e) {
        res.status(404).json('Token invalido')
      }
      const user = await Users.findById(id_usr)
      if (user) {
        let token_user = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            img: user.img
          },
          process.env.SECRET_KEY,
          {expiresIn: '1m'}
        )
        res.status(200).json(token_user)
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
