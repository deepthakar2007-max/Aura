const activityLogModel = require("../model/activityLog_model");

const logActivity = async (adminId, action, module) => {
    try {
        await activityLogModel.create({ admin: adminId, action, module });
    } catch (error) {
        console.log("Activity log failed:", error.message);
    }
};

module.exports = logActivity;