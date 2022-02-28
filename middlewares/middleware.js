const Campground = require('../models/campground');
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const Review = require('../models/review'); 

// login middleware using passport method
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login')
    }
    next();
};

//campgrounds validation middleware
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

//middleware that ensures your're the author of a middleware to update or delete campground it
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}; 

//middleware to ensure you're the author in order to delete a review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}; 

//reviews validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};