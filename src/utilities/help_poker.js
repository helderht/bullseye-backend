const group = []
// join user
function user_join(room, id, name, img) {
  const member = {room, id, name, img}
  if (!group.some(elm => elm.id === member.id)) {
    group.push(member)
  }
  return member
}
// leave user
function user_leave(id) {
  const index = group.findIndex(member => member.id === id)
  if (index !== -1) {
    return group.splice(index, 1)[0]
  }
}
// get group users
function get_members(room) {
  return group.filter(member => member.room === room)
}

module.exports = {user_join, user_leave, get_members}
