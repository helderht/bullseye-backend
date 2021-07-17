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
        res.status(200).json({tag: 'suc', msg: 'Felicidades eres nuevo usuario'})
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
          let token_user = await token.encode(user._id, user.email, user.name, user.img)
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
  code: async (req, res) => {
    try {
      const user = await Users.findOne({email: req.body.email})
      if (user) {
        let code = Math.floor(Math.random() * (99999 - 10000) + 1)
        user.recovery = code
        const update = await user.save()
        let timethen = Date.now()
        res.status(200).json({code: update.recovery, timethen, email: user.email})
      } else {
        res.status(404).json('Email no encontrado')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  restore: async (req, res) => {
    try {
      let timenow = Date.now()
      const user = await Users.findOne({recovery: req.body.code})
      if (user) {
        if (timenow - req.body.timethen < 300000) {
          user.password = await user.encode(req.body.password)
          user.recovery = null
          await user.save()
          res
            .status(200)
            .json({tag: 'suc', msg: 'Operación exitosa, inicia con tu contraseña nueva'})
        } else {
          user.recovery = null
          await user.save()
          res.status(200).json({tag: 'inf', msg: 'El codigo de recuperación ha expirado'})
        }
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
