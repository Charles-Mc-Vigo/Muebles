const express = require('express');
const { checkUserAuth, checkAdminAuth } = require('../../middlewares/checkAuth');
const { createReviewsAndRatings, viewRaviewsAndRatings } = require('../../controllers/Rating/ratingController');
const router = express.Router();

router.post('/:furnitureId',checkUserAuth, createReviewsAndRatings);
router.get('/',checkAdminAuth, viewRaviewsAndRatings);


module.exports = router;