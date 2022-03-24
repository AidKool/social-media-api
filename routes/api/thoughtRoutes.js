const router = require('express').Router();

const {
  getThoughts,
  createThought,
  getThoughtByID,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getThoughtByID)
  .patch(updateThought)
  .delete(deleteThought);

// api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
