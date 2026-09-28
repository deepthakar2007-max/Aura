const mongoose = require("mongoose");

const permissionSchema = {
    dashboard: { type: Boolean, default: true },
    products: { type: Boolean, default: false },
    categories: { type: Boolean, default: false },
    orders: { type: Boolean, default: false },
    customers: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    payments: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },
};

const adminUserSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
        adminRole: { type: String, enum: ["Super Admin", "Admin", "Manager", "Staff"], default: "Staff" },
        permissions: permissionSchema,
    },
    { timestamps: true }
);

module.exports = mongoose.model("admin_user", adminUserSchema);