const { isValidObjectId } = require('mongoose');
const { User } = require('../models');

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
  if (isValidObjectId(req.params.userID)) {
    return User.findOne({ _id: req.params.userID })
      .select('-__v')
      .populate('thoughts')
      .populate('friends')
      .then((user) =>
        user
          ? res.status(200).json(user)
          : res.status(404).json({ message: 'No user with that ID' })
      )
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid User ID' });
}

function updateUser(req, res) {
  if (isValidObjectId(req.body.id)) {
    return User.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { username: req.body.username, email: req.body.email } }
    )
      .then((user) =>
        user
          ? res.status(200).json(user)
          : res.status(404).json({ message: 'No user with that ID' })
      )
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid User ID' });
}

function deleteUser(req, res) {
  if (isValidObjectId(req.body.id)) {
    return User.findOneAndDelete({ _id: req.body.id })
      .then((user) =>
        user
          ? res.status(200).json(user)
          : res.status(404).json({ message: 'No user with that ID' })
      )
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid User ID' });
}

function addFriend(req, res) {
  if (
    isValidObjectId(req.params.userID) &&
    isValidObjectId(req.body.friendID)
  ) {
    return Promise.all([
      User.findOne({ _id: req.params.userID })
        .exec()
        .then((user) => user),
      User.findOne({ _id: req.body.friendID })
        .exec()
        .then((friend) => friend),
    ])
      .then((results) => {
        const user = results[0];
        const friend = results[1];
        if (!user || !friend) {
          return res.status(404).json({ message: 'Not Found' });
        }

        return Promise.all([
          User.updateOne(
            { _id: req.params.userID },
            { $addToSet: { friends: req.body.friendID } }
          ),
          User.updateOne(
            { _id: req.body.friendID },
            { $addToSet: { friends: req.params.userID } }
          ),
        ]).then(() =>
          res.status(201).json({ message: 'Friend added successfully' })
        );
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid ID data' });
}

function removeFriend(req, res) {
  if (
    isValidObjectId(req.params.userID) &&
    isValidObjectId(req.body.friendID)
  ) {
    return Promise.all([
      User.findOne({ _id: req.params.userID, friends: req.body.friendID })
        .exec()
        .then((user) => user),
      User.findOne({ _id: req.body.friendID, friends: req.params.userID })
        .exec()
        .then((friend) => friend),
    ])
      .then((results) => {
        const user = results[0];
        const friend = results[1];
        if (!user || !friend) {
          return res.status(404).json({ message: 'Not Found' });
        }

        return Promise.all([
          User.updateOne(
            { _id: req.params.userID },
            { $pull: { friends: req.body.friendID } }
          ),
          User.updateOne(
            { _id: req.body.friendID },
            { $pull: { friends: req.params.userID } }
          ),
        ]).then(() =>
          res.status(201).json({ message: 'Friend removed successfully' })
        );
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid ID data' });
}

module.exports = {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};
