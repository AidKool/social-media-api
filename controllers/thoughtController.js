const Thought = require('../models/Thought');
const User = require('../models/User');

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

module.exports = { getThoughts, createThought };
