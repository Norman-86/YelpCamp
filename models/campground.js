const express = require('express');
const mongoose = require('mongoose');
const Review = require('./review')
const { Schema } = mongoose;

const imageSchema = new Schema({
        url: String,
        filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100')
});

const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

//mongoose middleware to delete a campground plus associated reviews from the DB
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {$in: doc.reviews }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);