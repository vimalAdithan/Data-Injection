import fs from "fs";
import csv from "csv-parser";
import { connectDB } from "../config/db.js";
await connectDB();
import { CustomerModel, OrderModel, ProductModel } from "../models/Model.js";

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Helper function to validate date format (YYYY-MM-DD)
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

// Helper function to validate positive numbers
function isPositiveNumber(value) {
  return !isNaN(value) && parseFloat(value) > 0;
}

// Helper function to validate integer values
function isPositiveInteger(value) {
  return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
}

const results = [];

async function processRow(row) {
  const {
    "Order ID": orderId,
    "Product ID": productId,
    "Product Name": productName,
    Category: category,
    "Unit Price": unitPrice,
    "Customer ID": customerId,
    "Customer Name": customerName,
    "Customer Email": customerEmail,
    "Customer Address": customerAddress,
    Region: region,
    "Date of Sale": dateOfSale,
    "Quantity Sold": quantitySold,
    Discount: discount,
    "Shipping Cost": shippingCost,
    "Payment Method": paymentMethod,
  } = row;

  // Validate required fields and data types
  if (
    !orderId ||
    !productId ||
    !productName ||
    !customerId ||
    !customerName ||
    !customerEmail ||
    !isValidEmail(customerEmail)
  ) {
    console.error(`Invalid data for Order ID: ${orderId ?? "-"}`);
    return;
  }

  if (!isValidDate(dateOfSale)) {
    console.error(`Invalid date format for Order ID: ${orderId}`);
    return;
  }

  if (!isPositiveInteger(quantitySold)) {
    console.error(`Invalid quantity for Order ID: ${orderId}`);
    return;
  }

  if (
    !isPositiveNumber(unitPrice) ||
    !isPositiveNumber(discount) ||
    !isPositiveNumber(shippingCost)
  ) {
    console.error(`Invalid price/cost for Order ID: ${orderId}`);
    return;
  }

  try {
    await ProductModel.updateOne(
      { productId },
      {
        productId,
        name: productName,
        category,
        unitPrice: parseFloat(unitPrice),
      },
      { upsert: true }
    );

    await CustomerModel.updateOne(
      { customerId },
      {
        customerId,
        name: customerName,
        email: customerEmail,
        address: customerAddress,
      },
      { upsert: true }
    );

    await OrderModel.create({
      orderId,
      productId,
      customerId,
      region,
      dateOfSale: new Date(dateOfSale),
      quantitySold: parseInt(quantitySold),
      discount: parseFloat(discount),
      shippingCost: parseFloat(shippingCost),
      paymentMethod,
    });
  } catch (err) {
    console.error(`Error inserting Order ID: ${orderId}`, err.message);
  }
}

fs.createReadStream("scripts/SampleData.csv")
  .pipe(csv())
  .on("data", async (row) => {
    results.push(row);
  })
  .on("end", async () => {
    const allPromises = results.map((row) => processRow(row));
    await Promise.all(allPromises);

    console.log("✅ CSV data loaded successfully.");
    process.exit(0); // Always exit cleanly
  });
