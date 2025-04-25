import { OrderModel } from "../models/Model.js";

export const getRevenue = async (req, res) => {
  const { start, end } = req.query;
  const fromDate = new Date(start);
  const toDate = new Date(end);
  const result = await OrderModel.aggregate([
    {
      $match: {
        dateOfSale: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "productId",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $addFields: {
        revenue: {
          $subtract: [
            {
              $multiply: ["$productDetails.unitPrice", "$quantitySold"],
            },
            "$discount",
          ],
        },
      },
    },
    {
      $facet: {
        totalRevenue: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$revenue" },
            },
          },
        ],
        totalRevenueByProduct: [
          {
            $group: {
              _id: "$productId",
              totalRevenue: { $sum: "$revenue" },
              productName: {
                $first: "$productDetails.name",
              },
            },
          },
        ],
        totalRevenueByCategory: [
          {
            $group: {
              _id: "$productDetails.category",
              totalRevenue: { $sum: "$revenue" },
            },
          },
        ],
        totalRevenueByRegion: [
          {
            $group: {
              _id: "$region",
              totalRevenue: { $sum: "$revenue" },
            },
          },
        ],
      },
    },
  ]);

  res.json({
    result,
  });
};
