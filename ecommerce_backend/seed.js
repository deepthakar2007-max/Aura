const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const productModel = require("./model/product_model");

const products = [
    {
        name: "Aethelgard Chronograph",
        price: 3450,
        description: "Swiss-made automatic chronograph with sapphire crystal and leather strap.",
        img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&q=80",
        category: "men",
        stock: 8,
    },
    {
        name: "Verona Calfskin Satchel",
        price: 2100,
        description: "Hand-stitched Italian calfskin satchel with gold-tone hardware.",
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80",
        category: "accessories",
        stock: 12,
    },
    {
        name: "Solstice Gold Pendant",
        price: 1850,
        description: "18k gold pendant necklace featuring a brilliant-cut solitaire diamond.",
        img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80",
        category: "accessories",
        stock: 3,
    },
    {
        name: "Sovereign Wool Overcoat",
        price: 4200,
        description: "Tailored double-breasted overcoat in premium merino wool.",
        img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700&q=80",
        category: "men",
        stock: 6,
    },
    {
        name: "Nomad Leather Duffel",
        price: 2890,
        description: "Full-grain leather weekender duffel with brass fittings.",
        img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=700&q=80",
        category: "accessories",
        stock: 10,
    },
    {
        name: "Skeleton Tourbillon Watch",
        price: 8750,
        description: "Hand-assembled skeleton tourbillon movement, visible gears, rose gold case.",
        img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&q=80",
        category: "men",
        stock: 2,
    },
    {
        name: "Imperial Diamond Ring",
        price: 6400,
        description: "Emerald-cut diamond solitaire set in platinum band.",
        img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80",
        category: "accessories",
        stock: 4,
    },
    {
        name: "Milano Leather Oxfords",
        price: 1250,
        description: "Handcrafted burgundy leather oxford shoes with leather sole.",
        img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=700&q=80",
        category: "footwear",
        stock: 15,
    },
    {
        name: "Floral Silk Midi Dress",
        price: 890,
        description: "Flowing silk midi dress with hand-painted floral print.",
        img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=80",
        category: "women",
        stock: 20,
    },
    {
        name: "Aura Horizon Smartwatch",
        price: 2850,
        description: "Titanium smartwatch with sapphire display and health tracking.",
        img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=700&q=80",
        category: "electronics",
        stock: 18,
    },
    {
        name: "Cashmere Wrap Coat",
        price: 1950,
        description: "Luxuriously soft cashmere wrap coat in camel tone.",
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80",
        category: "women",
        stock: 9,
    },
    {
        name: "Heritage Leather Wallet",
        price: 320,
        description: "Slim bifold wallet in vegetable-tanned Italian leather.",
        img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&q=80",
        category: "accessories",
        stock: 25,
    },
    {
        name: "Noir Aviator Sunglasses",
        price: 480,
        description: "Polarized aviator sunglasses with 18k gold-plated frame.",
        img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80",
        category: "accessories",
        stock: 30,
    },
    {
        name: "Kids Cashmere Sweater",
        price: 210,
        description: "Soft cashmere-blend sweater for kids, available in pastel tones.",
        img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80",
        category: "kids",
        stock: 22,
    },
    {
        name: "Studio Wireless Headphones",
        price: 599,
        description: "Premium over-ear headphones with active noise cancellation.",
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
        category: "electronics",
        stock: 14,
    },
];

async function seed() {
    console.log("Starting seed script…");
    await mongoose.connect(process.env.URL);
    console.log("Database connected ✅");

    const deleteResult = await productModel.deleteMany({});
    console.log("Deleted old products:", deleteResult.deletedCount);

    const inserted = await productModel.insertMany(products);
    console.log("Inserted products:", inserted.length);

    await mongoose.disconnect();
    console.log("Done ✅ — disconnected from DB");
}

seed().catch((err) => {
    console.log("Seeding failed ❌");
    console.log(err);
});