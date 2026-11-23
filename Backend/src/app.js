import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import bookRoute from "./routes/bookRoute.js";
import userRoute from "./routes/userRoute.js";
import collectionRoute from "./routes/collectionRoute.js";
import reviewRoute from "./routes/reviewRoute.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoute);
app.use("/api", bookRoute);
app.use("/api", userRoute);
app.use("/api", collectionRoute);
app.use("/api", reviewRoute);

app.use('', (req, res) => {
  res.status(404).send('Página no encontrada')
})
