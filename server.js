import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./config/db.js";
import Router from "./Router.js";
import "./utils/dataRefresh.js";
const app = express();
connectDB();

app.use("/api", Router);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`Server is Running in ${PORT}`));
