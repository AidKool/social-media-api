const router = require('express').Router();

const {
  getThoughts,
  createThought,
  getThoughtByID,
  updateThought,
  deleteThought,
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

module.exports = router;
