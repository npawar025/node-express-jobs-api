import * as dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import connectDB from "./db/connect.js";
import authRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/authentication.js";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
//swagger
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger.yaml");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
