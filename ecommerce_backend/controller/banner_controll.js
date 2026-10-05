const bannerModel = require("../model/banner_model");

const getPublicBanners = async (req, res) => {
    try {
        const filter = { status: "active" };
        if (req.query.position) filter.position = req.query.position;
        const banners = await bannerModel.find(filter).sort({ order: 1 });
        res.json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getPublicBanners };