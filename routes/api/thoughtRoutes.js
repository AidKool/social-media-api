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
router
  .route('/')
  .get(getThoughts)
  .post(createThought)
  .patch(updateThought)
  .delete(deleteThought);

// api/thoughts/:thoughtID
router.route('/:thoughtID').get(getThoughtByID);

// api/thoughts/:thoughtID/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;
