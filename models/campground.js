const express = require('express');
const mongoose = require('mongoose');
const Review = require('./review')
const { Schema } = mongoose;

//image schema for manipulating images
const imageSchema = new Schema({
        url: String,
        filename: String
});

//virtual - we dont need to query db to transform image size since images are already stored in Mongo
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100')
});

//mongoose virtual
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, opts);

//mongoose virtual for mapbox properties
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}}...</p>
    `
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