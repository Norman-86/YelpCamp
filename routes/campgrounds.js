const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middlewares/middleware')

router.route('/')
//display all campgrounds
.get(catchAsync(campgrounds.index))
//adding a campground
.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
//display the form for adding a campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
//display single campground
    .get(catchAsync(campgrounds.showCampground))
//edit put route
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
//edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;