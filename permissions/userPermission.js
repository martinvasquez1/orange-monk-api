const scopedUsers = (user, users) => {
  if (user.role === 'admin') return users;
  return users.filter((u) => u._id.toString() === user.id);
};

const canViewUser = (user, u) => {
  return user.role === 'admin' || u._id.toString() === user.id;
};

const canUpdateUser = (user, u) => {
  return user.role === 'admin' || u._id.toString() === user.id;
};

const canDeleteUser = (user, u) => {
  return user.role === 'admin' || u._id.toString() === user.id;
};

module.exports = {
  scopedUsers,
  canViewUser,
  canUpdateUser,
  canDeleteUser,
};
