const { User, Thought } = require('../models');

async function getThoughts(_, res) {
  try {
    const thoughts = await Thought.find();
    return res.status(200).json(thoughts);
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function createThought(req, res) {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findByIdAndUpdate(req.body.userId, {
      $addToSet: { thoughts: thought._id },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Thought created but no User with this ID!' });
    }
    return res.status(201).json({ message: 'Thought successfully created!' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function getThoughtByID(req, res) {
  try {
    const thought = await Thought.findById(req.params.thoughtId).select('-__v');
    return thought
      ? res.status(200).json(thought)
      : res.status(404).json({ message: 'No thought with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function updateThought(req, res) {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: { thoughtText: req.body.thoughtText } },
      { new: true }
    );
    return thought
      ? res.status(200).json(thought)
      : res.status(404).json({ message: 'No thought with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function deleteThought(req, res) {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );
    return res.status(200).json({ message: 'Thought successfully deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function addReaction(req, res) {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $addToSet: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { new: true }
    );
    return thought
      ? res.status(200).json(thought)
      : res.status(404).json({ message: 'No thought with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

async function deleteReaction(req, res) {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { new: true }
    );
    return thought
      ? res.status(200).json({ message: 'Reaction successfully deleted' })
      : res.status(404).json({ message: 'No thought with that ID' });
  } catch (error) {
    return res.status(400).json({ message: 'Bad request' });
  }
}

module.exports = {
  getThoughts,
  createThought,
  getThoughtByID,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
};
