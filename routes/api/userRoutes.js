const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/users
router
  .route('/')
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

// /api/users/:userID
router.route('/:userID').get(getUserByID);

// /api/users/friends/
router.route('/:userID/friends').post(addFriend).delete(removeFriend);

module.exports = router;
