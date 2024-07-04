import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import dbConnection from "./dbConfig/dbConnection.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT ;

// MONGODB CONNECTION
dbConnection();

// middlenames
app.use(cors());
app.options('*', cors());

app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(router);

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});
