import { OrderModel } from "../models/Model.js";

export const getRevenue = async (req, res) => {
  const { option, start, end } = req.query;
  const fromDate = new Date(start);
  const toDate = new Date(end);

  const result = await OrderModel.find({});

  res.json({
    result,
  });
};
