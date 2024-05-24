import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import router from "./router";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use("/", router());

const server = http.createServer(app);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const MONGO_URL =
  "mongodb+srv://root:root1234@parkings-reservation-da.hshdeks.mongodb.net/?retryWrites=true&w=majority&appName=parkings-reservation-database";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});
