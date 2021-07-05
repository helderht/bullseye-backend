const Activities = require('../models/activities')

module.exports = {
  reg_act: async (operation, id_project, id_user) => {
    const act = new Activities({operation, id_project, id_user})
    await act.save()
  }
}
