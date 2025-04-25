import express from "express";
import { refreshData } from "./Controller/Refresh-Data.js";
import { getRevenue } from "./Controller/Revenue.js";
const Router = express.Router();

Router.get("/refresh", refreshData);
Router.post("/revenue", getRevenue);

export default Router;
