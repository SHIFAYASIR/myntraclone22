const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const sqlHelper = require('../../utils/sql.helper');

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Function to insert payment details into the database
const insertPaymentDetails = async (paymentDetails) => {
  const params = [
    { name: 'PaymentID', value: paymentDetails.id },
    { name: 'OrderID', value: paymentDetails.order_id },
    { name: 'Amount', value: paymentDetails.amount / 100 }, // Convert paise to INR
    { name: 'Currency', value: paymentDetails.currency },
    { name: 'Status', value: paymentDetails.status },
    { name: 'Method', value: paymentDetails.method },
    { name: 'Description', value: paymentDetails.description || '' },
    { name: 'CreatedAt', value: new Date(paymentDetails.created_at * 1000) }, // Convert Unix timestamp to Date
    { name: 'UpdatedAt', value: new Date() }
  ];

  await sqlHelper.execute('sp_InsertPaymentDetails', params);
};

// Create Razorpay Order
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;
  console.log("Request Body:", req.body);
  console.log("Razorpay Instance:", instance);

  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await instance.orders.create(options);
    console.log("Created Order:", order);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Verify Razorpay Payment
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    try {
      // Fetch payment details from Razorpay
      const paymentDetails = await instance.payments.fetch(razorpay_payment_id);
      console.log("Payment Details:", paymentDetails);

      // Insert payment details into the database
      
      await insertPaymentDetails(paymentDetails);

      res.status(200).json({
        message: "Payment verified successfully",
        paymentDetails
      });
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Invalid payment verification" });
  }
});

module.exports = {
  createOrder,
  verifyPayment
};
