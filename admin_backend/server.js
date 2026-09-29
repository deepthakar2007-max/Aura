const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();


const allowedOrigins = [
    "http://localhost:5173",
    "https://adminfrontend-lilac.vercel.app",
    "http://localhost:5174",
    "https://aura-bay-beta.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json({ limit: "5mb" }));

const connectdb = require("./config/db");
connectdb();

app.use("/admin/auth", require("./routes/admin_auth_routes"));
app.use("/admin/orders", require("./routes/order_routes"));
app.use("/admin/customers", require("./routes/customer_routes"));
app.use("/admin/products", require("./routes/product_routes"));
app.use("/admin/categories", require("./routes/category_routes"));
app.use("/admin/coupons", require("./routes/coupon_routes"));
app.use("/admin/reviews", require("./routes/review_routes"));
app.use("/admin/brands", require("./routes/brand_routes"));
app.use("/admin/inventory", require("./routes/inventory_routes"));
app.use("/admin/payments", require("./routes/payment_routes"));
app.use("/admin/returns", require("./routes/return_routes"));
app.use("/admin/analytics", require("./routes/analytics_routes"));
app.use("/admin/notifications", require("./routes/notification_routes"));
app.use("/admin/banners", require("./routes/banner_routes"));
app.use("/admin/settings", require("./routes/settings_routes"));
app.use("/admin/admin-users", require("./routes/adminUser_routes"));
app.use("/admin/activity-logs", require("./routes/activityLog_routes"));

app.get("/", (req, res) => res.send("Admin server running 💪"));

app.listen(process.env.PORT || 5001, () => {
    console.log(`Admin server running on port ${process.env.PORT || 5001}`);
});