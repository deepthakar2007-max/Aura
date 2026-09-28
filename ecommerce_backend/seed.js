const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const productModel = require("./model/product_model");

const P = [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700&q=80",
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=700&q=80",
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=700&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80",
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=700&q=80",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=700&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80",
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
    "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=700&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&q=80",
];

const gallery = (i) => [P[i % 24], P[(i + 6) % 24], P[(i + 12) % 24], P[(i + 18) % 24]];

const raw = [
    ["Heritage Wool Blazer", 18500, "men", 12],
    ["Classic Oxford Shirt", 3200, "men", 25],
    ["Tailored Chino Trousers", 4200, "men", 20],
    ["Merino Wool Sweater", 6500, "men", 15],
    ["Leather Bomber Jacket", 24500, "men", 8],
    ["Slim Fit Denim Jeans", 3800, "men", 22],
    ["Formal Silk Tie Set", 2400, "men", 30],
    ["Linen Summer Shirt", 2900, "men", 18],
    ["Quilted Puffer Jacket", 15500, "men", 10],
    ["Silk Wrap Dress", 8900, "women", 14],
    ["Cashmere Cardigan", 12500, "women", 11],
    ["Pleated Midi Skirt", 4500, "women", 19],
    ["Tailored Blazer Set", 16500, "women", 9],
    ["Floral Chiffon Blouse", 3200, "women", 24],
    ["High-Waist Trousers", 5200, "women", 17],
    ["Embroidered Kurta Set", 4800, "women", 16],
    ["Velvet Evening Gown", 22000, "women", 6],
    ["Cotton Summer Dress", 3600, "women", 21],
    ["Cotton Graphic T-Shirt", 850, "kids", 35],
    ["Denim Overalls", 1450, "kids", 28],
    ["Fleece Hoodie Set", 1800, "kids", 26],
    ["Party Frock Dress", 2200, "kids", 20],
    ["Woolen Winter Jacket", 2900, "kids", 15],
    ["Printed Pajama Set", 1200, "kids", 30],
    ["School Uniform Set", 1650, "kids", 25],
    ["Cartoon Rain Boots", 950, "kids", 22],
    ["Classic Leather Oxfords", 6500, "footwear", 14],
    ["Running Sports Shoes", 4200, "footwear", 26],
    ["Suede Chelsea Boots", 8900, "footwear", 10],
    ["Casual Canvas Sneakers", 2400, "footwear", 32],
    ["Formal Derby Shoes", 7200, "footwear", 12],
    ["Strappy Block Heels", 3800, "footwear", 18],
    ["Leather Loafers", 5500, "footwear", 16],
    ["Hiking Trail Boots", 6800, "footwear", 13],
    ["Wireless Noise Cancelling Headphones", 8900, "electronics", 17],
    ["Smart Fitness Watch", 12500, "electronics", 15],
    ["Portable Bluetooth Speaker", 4500, "electronics", 24],
    ["Wireless Earbuds Pro", 6900, "electronics", 20],
    ["4K Action Camera", 18500, "electronics", 8],
    ["Smart Home Hub", 5200, "electronics", 19],
    ["Gaming Mechanical Keyboard", 7500, "electronics", 14],
    ["Power Bank 20000mAh", 2200, "electronics", 30],
    ["Leather Bifold Wallet", 1800, "accessories", 28],
    ["Aviator Sunglasses", 2400, "accessories", 25],
    ["Silk Printed Scarf", 1600, "accessories", 22],
    ["Leather Weekend Duffel", 9500, "accessories", 11],
    ["Gold Plated Cufflinks", 3200, "accessories", 16],
    ["Leather Crossbody Bag", 6500, "accessories", 14],
    ["Diamond Stud Earrings", 45000, "accessories", 5],
    ["Structured Tote Bag", 7800, "accessories", 13],
];

const products = raw.map(([name, price, category, stock], i) => {
    const imgs = gallery(i);
    return {
        name,
        price,
        description: `Premium quality ${name.toLowerCase()}, crafted with attention to detail and lasting durability.`,
        img: imgs[0],
        images: imgs,
        category,
        stock,
    };
});

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