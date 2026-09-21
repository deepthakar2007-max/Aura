const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const categoryModel = require("./model/category_model");

const categories = [
    {
        name: "men",
        img: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&q=80",
        description: "Shirts, jackets, and everyday essentials for men.",
        status: "active",
    },
    {
        name: "women",
        img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
        description: "Dresses, tops, and outfits for every occasion.",
        status: "active",
    },
    {
        name: "kids",
        img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80",
        description: "Comfortable and playful clothing for kids.",
        status: "active",
    },
    {
        name: "footwear",
        img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
        description: "Sneakers, boots, and sandals for every step.",
        status: "active",
    },
    {
        name: "electronics",
        img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80",
        description: "Gadgets and accessories for everyday tech needs.",
        status: "active",
    },
    {
        name: "accessories",
        img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
        description: "Bags, sunglasses, and finishing touches.",
        status: "active",
    },
];

async function seed() {
    console.log("Starting category seed…");
    await mongoose.connect(process.env.URL);
    console.log("Database connected ✅");

    await categoryModel.deleteMany({});
    const inserted = await categoryModel.insertMany(categories);
    console.log("Inserted categories:", inserted.length);

    await mongoose.disconnect();
    console.log("Done ✅");
}

seed().catch((err) => {
    console.log("Seeding failed ❌");
    console.log(err);
});