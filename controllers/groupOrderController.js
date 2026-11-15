const GroupOrder = require('../models/GroupOrder');
const Product = require('../models/product');
const Order = require('../models/order');

// 1. First Customer starts a brand new Group Order
exports.createGroupOrder = async (req, res) => {
  try {
    const { productId, requestedQuantity, shippingAddress } = req.body;

    // Fetch the product details to verify the merchant and bulk target limits
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Assume your Product Model has a field like 'bulkTarget' or 'minimumBulkQty'. 
    // If not, we fall back to a default or value provided from req.body (e.g., 5000)
    const targetQuantity = product.bulkTargetQuantity || 5000; 

    if (requestedQuantity >= targetQuantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Your requested quantity meets or exceeds the bulk target of ${targetQuantity}. You should place a direct regular order instead.` 
      });
    }

    // Create a new staging group entry
    const newGroupOrder = new GroupOrder({
      productId,
      merchantId: product.merchantId, // Automatically link the owner merchant
      targetQuantity,
      currentQuantity: requestedQuantity, // Starts with the first customer's allocation
      status: 'Open',
      participants: [
        {
          customerId: req.user.id, // Logged in customer's ID from protect middleware
          requestedQuantity,
          shippingAddress,
          isPaid: true // Assuming payment framework handles initial checkout verification
        }
      ]
    });

    const savedGroup = await newGroupOrder.save();

    res.status(201).json({
      success: true,
      message: "Group order initiated successfully! Waiting for other buyers to join.",
      remainingQuantityNeeded: targetQuantity - requestedQuantity,
      data: savedGroup
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while creating group order",
      error: error.message
    });
  }
};
// 2. A second customer joins an existing open Group Order
exports.joinGroupOrder = async (req, res) => {
  try {
    const { groupOrderId } = req.params;
    const { requestedQuantity, shippingAddress } = req.body;

    // 1. Find the existing open group order
    const groupOrder = await GroupOrder.findById(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ success: false, message: "Group order not found." });
    }

    if (groupOrder.status !== 'Open') {
      return res.status(400).json({ success: false, message: "This group order is no longer open for joining." });
    }

    // 2. Check if adding this quantity exceeds the target limit
    const totalNewQuantity = groupOrder.currentQuantity + requestedQuantity;
    if (totalNewQuantity > groupOrder.targetQuantity) {
      const remainingAllowed = groupOrder.targetQuantity - groupOrder.currentQuantity;
      return res.status(400).json({ 
        success: false, 
        message: `Your quantity exceeds the group target threshold. You can only request up to ${remainingAllowed} units to finish this group.` 
      });
    }

    // 3. Add the new user to the participants array pool
    groupOrder.participants.push({
      customerId: req.user.id, // Extracted securely from your auth login token middleware
      requestedQuantity,
      shippingAddress,
      isPaid: true
    });

    // Update the running aggregate count
    groupOrder.currentQuantity = totalNewQuantity;

    // 4. Automated Fulfill Trigger: If target quota is met (e.g. hits 5000), compile and dispatch to main orders collection
    if (groupOrder.currentQuantity === groupOrder.targetQuantity) {
      groupOrder.status = 'Completed';

      // Transform the composite pool straight into an operational Order layout
      const finalItemsArray = groupOrder.participants.map(part => ({
        productId: groupOrder.productId,
        merchantId: groupOrder.merchantId,
        quantity: part.requestedQuantity,
        price: 150, // In production, resolve product.price dynamically
        status: 'Pending'
      }));

      // Calculate aggregated bulk evaluation total matching your business layers
      const baseTotalAmount = groupOrder.targetQuantity * 150; 

      // Save a permanent operational baseline in your primary orders collection
      const operationalOrder = new Order({
        customerId: req.user.id, // Track the group initiator as the lead payload head
        items: finalItemsArray,
        totalAmount: baseTotalAmount,
        shippingAddress: "Multiple Delivery Locations - Check participant metadata logs.",
        paymentStatus: 'Paid'
      });

      await operationalOrder.save();
    }

    const updatedGroupRecord = await groupOrder.save();

    res.status(200).json({
      success: true,
      message: groupOrder.status === 'Completed' 
        ? "Success! The group limit has been fulfilled. An official order has been created for the merchant dashboard." 
        : "Successfully joined the group order! Waiting for remaining units to be claimed.",
      remainingQuantityNeeded: groupOrder.targetQuantity - groupOrder.currentQuantity,
      data: updatedGroupRecord
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while joining group order",
      error: error.message
    });
  }
};