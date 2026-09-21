const express = require("express");
const app = express();

app.use(express.json({ limit: "5mb" }));
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const connectdb = require("./config/db.js");
connectdb();
app.use(cors());

const userrouter = require("./routes/user_routes.js");
const productrouter = require("./routes/product_routes.js");
const cartrouter = require("./routes/cart_routes.js");
const reviewrouter = require("./routes/review_routes.js");
const paymentrouter = require("./routes/payment_routes.js");
const categoryrouter = require("./routes/category_routes.js");
const couponrouter = require("./routes/coupon_routes.js");
const wishlistrouter = require('./routes/wishlist_routes.js')
const addressrouter = require('./routes/address_routes.js')
const orderrouter = require("./routes/order_routes.js");


app.use("/auth/user", userrouter);
app.use("/auth/product", productrouter);
app.use("/auth/cart", cartrouter);
app.use("/auth/review", reviewrouter);
app.use("/auth/payment", paymentrouter);
app.use("/auth/category", categoryrouter);
app.use("/auth/coupon", couponrouter);
app.use("/auth/address", addressrouter);
app.use("/auth/wishlist", wishlistrouter);
app.use("/auth/order", orderrouter);

app.get("/", (req, res) => {
  res.send("server worked 💪");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});