const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

//getting a random element from an array
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (i = 0; i < 50; i++) {
        const random1000 = Math.ceil(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 500;
        const camp = new Campground({
            author: '620f86a68e2e63df219fccd8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, laborum cumque nulla quod consectetur dolor explicabo ipsa, sint autem iure possimus dolorem quas labore similique, optio vitae at quaerat quis!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/the-park/image/upload/v1646996612/YelpCamp/dnqiqbwmbbivbrvezu7k.jpg',
                    filename: 'YelpCamp/dnqiqbwmbbivbrvezu7k',
                },
                {
                    url: 'https://res.cloudinary.com/the-park/image/upload/v1646994877/YelpCamp/wdefw3runt1t8jsr7vte.jpg',
                    filename: 'YelpCamp/wdefw3runt1t8jsr7vte.jpg',
                }
            ]
        });
        await camp.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});