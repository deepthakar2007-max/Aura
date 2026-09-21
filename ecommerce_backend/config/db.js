const mongoose = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Database connected ✅");
  } catch (error) {
    console.log("Database connection failed ❌");
    console.log(error.message);
  }
};

module.exports = connectdb;