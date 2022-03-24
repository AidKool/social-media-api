const { isValidObjectId } = require('mongoose');
const { User, Thought } = require('../models');

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
  if (isValidObjectId(req.params.userId)) {
    return User.findOne({ _id: req.params.userId })
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
  if (isValidObjectId(req.params.userId)) {
    return User.findOneAndUpdate(
      { _id: req.params.userId },
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
  if (isValidObjectId(req.params.userId)) {
    return User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          return null;
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No data found' });
        }
        return res
          .status(200)
          .json({ message: 'User and their thoughts deleted successfully' });
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid User ID' });
}

function addFriend(req, res) {
  if (
    isValidObjectId(req.params.userId) &&
    isValidObjectId(req.body.friendId)
  ) {
    return Promise.all([
      User.findOne({ _id: req.params.userId })
        .exec()
        .then((user) => user),
      User.findOne({ _id: req.body.friendId })
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
            { _id: req.params.userId },
            { $addToSet: { friends: req.body.friendId } }
          ),
          User.updateOne(
            { _id: req.body.friendId },
            { $addToSet: { friends: req.params.userId } }
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
    isValidObjectId(req.params.userId) &&
    isValidObjectId(req.params.friendId)
  ) {
    return Promise.all([
      User.findOne({ _id: req.params.userId, friends: req.params.friendId })
        .exec()
        .then((user) => user),
      User.findOne({ _id: req.params.friendId, friends: req.params.userId })
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
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } }
          ),
          User.updateOne(
            { _id: req.params.friendId },
            { $pull: { friends: req.params.userId } }
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
