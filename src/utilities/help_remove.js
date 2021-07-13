const Categories = require('../models/categories'),
  Projects = require('../models/projects'),
  Collaborations = require('../models/collaborations'),
  Estimates = require('../models/estimates'),
  FPsnapshots = require('../models/snapshots_fp'),
  SPsnapshots = require('../models/snapshots_sp'),
  UCPsnapshots = require('../models/snapshots_ucp'),
  Messages = require('../models/messages'),
  Activities = require('../models/activities'),
  Notifications = require('../models/notifications')

module.exports = {
  rmMessages: async idsnap => {
    return await Messages.deleteMany({id_snapshot: idsnap})
  },
  rmSnapshotFP: async idest => {
    return await FPsnapshots.deleteMany({id_estimate: idest})
  },
  rmSnapshotSP: async idest => {
    return await SPsnapshots.deleteMany({id_estimate: idest})
  },
  rmSnapshotUCP: async idest => {
    return await UCPsnapshots.deleteMany({id_estimate: idest})
  },
  rmCollaborations: async idpro => {
    return await Collaborations.deleteMany({id_project: idpro})
  },
  rmEstimates: async idpro => {
    return await Estimates.deleteMany({id_project: idpro})
  },
  rmActivities: async idpro => {
    return await Activities.deleteMany({id_project: idpro})
  },
  rmNotifications: async idpro => {
    return await Notifications.deleteMany({id_project: idpro})
  }
}
