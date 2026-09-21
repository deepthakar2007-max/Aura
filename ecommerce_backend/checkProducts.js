const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const productModel = require("./model/product_model");

const check = async () => {
    await mongoose.connect(process.env.URL);
    const products = await productModel.find();
    console.log("Total products:", products.length);
    products.forEach(p => console.log("-", p.name));
    process.exit();
};

check();