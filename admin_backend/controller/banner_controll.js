const bannerModel = require("../model/banner_model");

const getAllBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find().sort({ order: 1 });
        res.json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBanner = async (req, res) => {
    try {
        const { title, image } = req.body;
        if (!title || !image) return res.status(400).json({ success: false, message: "Title and image required" });
        const banner = await bannerModel.create(req.body);
        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!banner) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: banner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const banner = await bannerModel.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllBanners, createBanner, updateBanner, deleteBanner };