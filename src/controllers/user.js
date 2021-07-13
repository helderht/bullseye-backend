const Users = require('../models/users'),
  fse = require('fs-extra'),
  path = require('path')

module.exports = {
  cover: async (req, res) => {
    try {
      const path_temp = req.file.path
      const ext = path.extname(req.file.originalname).toLowerCase()
      const path_target = path.resolve(`src/public/assets/avatars/${req.file.filename}${ext}`)
      if (ext === '.jpg' || ext === '.png') {
        await fse.rename(path_temp, path_target)
        const usr = await Users.findByIdAndUpdate(req.info_user._id, {
          img: `${req.file.filename}${ext}`
        })
        if (usr) {
          if (usr.img !== 'cover.png')
            await fse.unlink(path.resolve(`src/public/assets/avatars/${usr.img}`))
          res.status(200).json({tag: 'suc', msg: 'Los cambios se aplicaran en la siguiente sesión'})
        }
      } else {
        await fse.unlink(path_temp)
        res.status(403).json('Archivo invalido')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  update: async (req, res) => {
    res.send('update')
  },
  remove: async (req, res) => {
    res.send('remove')
  }
}
