const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const axios = require('axios')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb+srv://garrett:WbPC3uL0rNRm0ltC@campgrounds.pcpwmwg.mongodb.net/campgrounds?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!")
});



const sample = (array) => array[Math.floor(Math.random() * array.length)];


// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://placeimg.com/640/480/nature')
    }
    catch {
        console.log("failed pic")
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i <100; i++) {
        const placeSeed = Math.floor(Math.random() * places.length)
        const descriptorsSeed = Math.floor(Math.random() * descriptors.length)
        const citySeed = Math.floor(Math.random() * cities.length)
        const price = Math.floor(Math.random() * 20) + 10;


        // seed data into campground
        const camp = new Campground({
            imageUrl: await seedImg(),
            title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
            author: '63a0e53024948d6b9452ff0b',
            location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
            geometry: { 
                type: 'Point', 
                coordinates: [cities[citySeed].longitude, cities[citySeed].latitude  ] 
            },
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/djjaxwfvu/image/upload/v1671645294/CampCritic/odj6jb1vusazqbmrqic9.webp',
                    filename: 'CampCritic/odj6jb1vusazqbmrqic9'
                  },
                  {
                    url: 'https://res.cloudinary.com/djjaxwfvu/image/upload/v1671645294/CampCritic/ooonnoj7sz68o6g1gl1y.webp',
                    filename: 'CampCritic/ooonnoj7sz68o6g1gl1y'
                  }
            ]
        });

        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

