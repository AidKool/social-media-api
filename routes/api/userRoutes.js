const router = require('express').Router();

const {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
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

module.exports = router;
