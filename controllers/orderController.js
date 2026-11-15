const mongoose = require('mongoose');
const Order = require('../models/order');

// 1. Fetch all orders for a specific customer
const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId }).populate('customer').populate('products.product');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching customer orders" });
  }
};
// Get monthly revenue analytics for the logged-in Merchant's graph
exports.getMerchantSalesGraphData = async (req, res) => {
  try {
    // In production, this uses req.user.id. 
    // For testing without tokens, you can hardcode a temporary merchant ID string.
    const merchantId = req.user ? req.user.id : "6ace4686b97ed79b38425978"; 

    const salesData = await Order.aggregate([
      { $unwind: "$items" },
      { 
        $match: { 
          "items.merchantId": new mongoose.Types.ObjectId(merchantId),
          "paymentStatus": "Paid" 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          monthlyRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          totalItemsSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = salesData.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.monthlyRevenue,
      unitsSold: item.totalItemsSold
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while fetching sales graph data",
      error: error.message
    });
  }
};