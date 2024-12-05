const express = require('express');
const { checkUserAuth, checkAdminAuth } = require('../../middlewares/checkAuth');
const { createReviewsAndRatings, viewRaviewsAndRatings, getRatingOfaFurniture } = require('../../controllers/Rating/ratingController');
const router = express.Router();

router.post('/:furnitureId',checkUserAuth, createReviewsAndRatings);
router.get('/:furnitureId', checkUserAuth,getRatingOfaFurniture)
router.get('/',checkAdminAuth, viewRaviewsAndRatings);


module.exports = router;