const User = require('../models/User');

function getUsers(req, res) {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).json(error));
}

function createUser(req, res) {
  User.create(req.body)
    .then((dbUserData) => res.status(201).json(dbUserData))
    .catch((error) => res.status(500).json(error));
}

module.exports = { getUsers, createUser };
