const mongoose = require("mongoose");

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Admin DB connected ✅");
    } catch (error) {
        console.log("Admin DB connection failed ❌", error.message);
    }
};

module.exports = connectdb;