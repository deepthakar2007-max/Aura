const settingsModel = require("../model/settings_model");

const getSettings = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();
        if (!settings) settings = await settingsModel.create({});
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        let settings = await settingsModel.findOne();
        if (!settings) settings = await settingsModel.create(req.body);
        else settings = await settingsModel.findByIdAndUpdate(settings._id, req.body, { new: true });
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getSettings, updateSettings };