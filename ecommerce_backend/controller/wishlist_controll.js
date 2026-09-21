const wishlistModel = require("./../model/wishlist_model");

const addwishlist = async (req, res) => {
  try {
    let data = req.body;

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    if (!data.product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
      });
    }

    let response = await wishlistModel.create(data);

    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletewishlist = async (req, res) => {
  try {
    let response = await wishlistModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item deleted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getwishlistbyid = async (req, res) => {
  try {
    let response = await wishlistModel.find(data).populate("product");

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getwishlists = async (req, res) => {
  try {
    let data = req.query;

    let response = await wishlistModel.find(data).populate("product");

    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  addwishlist,
  deletewishlist,
  getwishlistbyid,
  getwishlists,
};