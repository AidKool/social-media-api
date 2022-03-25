const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getUserByID).patch(updateUser).delete(deleteUser);

// /api/users/:userId/friends/
router.route('/:userId/friends').post(addFriend).delete(deleteFriend);

module.exports = router;
