const Notifications = require('../models/notifications'),
  Collaborations = require('../models/collaborations')

module.exports = {
  notify_owner: async (message, id_project, id_user) => {
    const not = new Notifications({message, id_project, id_user})
    await not.save()
  },
  notify_team: async (message, id_project) => {
    const team = await Collaborations.find({id_project: id_project}).populate('id_user')
    if (team && team.length > 0) {
      for (const col of team) {
        const not = new Notifications({
          message,
          id_project,
          id_user: col.id_user._id
        })
        await not.save()
      }
    }
  },
  notify_col: async (message, id_project, id_user) => {
    const list = await Collaborations.find({id_project: id_project}).populate('id_user')
    if (list && list.length > 0) {
      const collaborators = list.filter(elm => elm.id_user._id.toString() !== id_user.toString())
      for (const col of collaborators) {
        const not = new Notifications({
          message,
          id_project,
          id_user: col.id_user._id
        })
        await not.save()
      }
    }
  }
}
