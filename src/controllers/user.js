const {findByIdAndDelete} = require('../models/users')
const Users = require('../models/users'),
  Projects = require('../models/projects'),
  Estimates = require('../models/estimates'),
  SPsnapshots = require('../models/snapshots_sp'),
  fse = require('fs-extra'),
  path = require('path'),
  bcrypt = require('bcryptjs'),
  {
    rmMessages,
    rmSnapshotFP,
    rmSnapshotSP,
    rmSnapshotUCP,
    rmNotifications,
    rmActivities,
    rmEstimates,
    rmCollaborations,
    rmCategories,
    rmProjects
  } = require('../utilities/help_remove')

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
    try {
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 8)
        let data = {name: req.body.name, email: req.body.email, password: hash}
        const updated = await Users.findByIdAndUpdate(req.info_user._id, data)
        if (updated)
          res.status(200).json({tag: 'suc', msg: 'Actualización exitosa, vuelve a iniciar'})
      } else {
        const updated = await Users.findByIdAndUpdate(req.info_user._id, req.body)
        if (updated)
          res.status(200).json({tag: 'suc', msg: 'Actualización exitosa, vuelve a iniciar'})
      }
    } catch (error) {
      res.status(500).send(error)
    }
  },
  remove: async (req, res) => {
    try {
      const user = await Users.findById(req.info_user._id)
      const match = await user.verify(req.params.pass)
      if (match) {
        const list_pro = await Projects.find({id_user: req.info_user._id})
        if (list_pro) {
          for (const pro of list_pro) {
            const list_est = await Estimates.find({id_project: pro._id})
            if (list_est) {
              for (const est of list_est) {
                if (est.way === 'sp') {
                  const sp = await SPsnapshots.find({id_estimate: est._id})
                  if (sp) {
                    for (const snap of sp) {
                      await rmMessages(snap._id)
                    }
                  }
                }
                await rmSnapshotFP(est._id)
                await rmSnapshotSP(est._id)
                await rmSnapshotUCP(est._id)
              }
            }
            await rmNotifications(pro._id)
            await rmActivities(pro._id)
            await rmEstimates(pro._id)
            await rmCollaborations(pro._id)
          }
          await rmCategories(req.info_user)
          await rmProjects(req.info_user)
          const removed = await Users.findByIdAndDelete(req.info_user._id)
          res.status(200).json({tag: 'suc', msg: 'Su cuenta ha sido borrada'})
        }
      } else {
        res.status(403).json({tag: 'war', msg: 'Contraseña incorrecta'})
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }
}
