const { isValidObjectId } = require('mongoose');
const { User, Thought } = require('../models');

function getThoughts(_, res) {
  Thought.find()
    .then((thoughts) => res.status(200).json(thoughts))
    .catch((error) => res.status(500).json(error));
}

function createThought(req, res) {
  Thought.create(req.body)
    .then((dbThoughtData) =>
      User.findOneAndUpdate(
        { _id: req.body.userID },
        { $addToSet: { thoughts: dbThoughtData._id } },
        { new: true }
      )
    )
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'Thought created but no User with this ID!' });
      }

      return res.status(201).json({ message: 'Thought successfully created!' });
    })
    .catch((error) => res.status(500).json(error));
}

function getThoughtByID(req, res) {
  if (isValidObjectId(req.params.thoughtID)) {
    return Thought.findOne({ _id: req.params.thoughtID })
      .select('-__v')
      .then((dbThoughtData) =>
        dbThoughtData
          ? res.status(200).json(dbThoughtData)
          : res.status(404).json({ message: 'No thought with that ID' })
      )
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid Thought ID' });
}

function updateThought(req, res) {
  if (isValidObjectId(req.body.id)) {
    return Thought.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { thoughtText: req.body.thoughtText } }
    )
      .then((dbThoughtData) =>
        dbThoughtData
          ? res.status(200).json(dbThoughtData)
          : res.status(404).json({ message: 'No thought with that ID' })
      )
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid Thought ID' });
}

function deleteThought(req, res) {
  if (isValidObjectId(req.body.id)) {
    return Thought.findOneAndDelete({ _id: req.body.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return null;
          // return res.status(404).json({ message: 'No thought with that ID' });
        }
        return User.findOneAndUpdate(
          { thoughts: req.body.id },
          { $pull: { thoughts: req.body.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({
            // what error status code to use? message?
            message: 'No thought with that ID',
          });
        }

        return res
          .status(200)
          .json({ message: 'Thought successfully deleted' });
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid Thought ID' });
}

function addReaction(req, res) {
  console.log(req.params.thoughtId);
  console.log(req.body);
  if (isValidObjectId(req.params.thoughtId)) {
    return Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $addToSet: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No Thought with that ID' });
        }
        return res.status(200).json(dbThoughtData);
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid Thought ID' });
}

function removeReaction(req, res) {
  if (
    isValidObjectId(req.params.thoughtId) &&
    isValidObjectId(req.params.reactionId)
  ) {
    return Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No Thought with that ID' });
        }
        return res.status(200).json(dbThoughtData);
      })
      .catch((error) => res.status(500).json(error));
  }
  return res.status(404).json({ message: 'Invalid Thought ID' });
}

module.exports = {
  getThoughts,
  createThought,
  getThoughtByID,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
};
