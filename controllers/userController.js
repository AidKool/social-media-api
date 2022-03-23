const User = require('../models/User');

function getUsers(_, res) {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json(error));
}

function createUser(req, res) {
  User.create(req.body)
    .then((dbUserData) => res.status(201).json(dbUserData))
    .catch((error) => res.status(500).json(error));
}

function getUserByID(req, res) {
  User.findOne({ _id: req.params.userID })
    .select('-__v')
    // .populate('thoughts')
    // .populate('friends')
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res.status(404).json({ message: 'No user with that ID' })
    )
    .catch((err) => res.status(500).json(err));
}

function updateUser(req, res) {
  User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { username: req.body.username, email: req.body.email } }
  )
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res.status(404).json({ message: 'No user with that ID' })
    )
    .catch((err) => res.status(500).json(err));
}

function deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.body.id })
    .then((user) =>
      user
        ? res.status(200).json(user)
        : res.status(404).json({ message: 'No user with that ID' })
    )
    .catch((err) => res.status(500).json(err));
}

module.exports = { getUsers, createUser, getUserByID, updateUser, deleteUser };
