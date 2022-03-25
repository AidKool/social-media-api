const { User, Thought } = require('../models');

async function getUsers(_, res) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function getUserByID(req, res) {
  try {
    const user = await User.findById(req.params.userId)
      .select('-__v')
      .populate('thoughts')
      .populate('friends');
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'No user with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $set: { username: req.body.username, email: req.body.email },
    });
    return user
      ? res.status(200).json({ message: 'User updated successfully' })
      : res.status(404).json({ message: 'No user with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }
    await Thought.deleteMany({
      _id: { $in: user.thoughts },
    });
    return res
      .status(200)
      .json({ message: 'User and associated thoughts deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function addFriend(req, res) {
  try {
    const userExists = await User.exists({ _id: req.params.userId });
    const friendExists = await User.exists({ _id: req.body.friendId });
    if (!userExists || !friendExists) {
      return res.status(404).json({ message: 'Not Found' });
    }
    await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { friends: req.body.friendId },
    });
    await User.findByIdAndUpdate(req.body.friendId, {
      $addToSet: { friends: req.params.userId },
    });
    return res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function deleteFriend(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.body.friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: 'Not Found' });
    }
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friends: req.body.friendId },
    });
    await User.findByIdAndUpdate(req.body.friendId, {
      $pull: { friends: req.params.userId },
    });
    return res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserByID,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
};
