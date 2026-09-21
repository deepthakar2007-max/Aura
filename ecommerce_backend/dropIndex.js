const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Database connected ✅");

        const collection = mongoose.connection.collection("products");
        const indexes = await collection.indexes();
        console.log("Current indexes:", indexes);

        await collection.dropIndex("modelNumber_1");
        console.log("Index dropped 🗑️");

        process.exit();
    } catch (error) {
        console.log("Error:", error.message);
        process.exit(1);
    }
};

run();