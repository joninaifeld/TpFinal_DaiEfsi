import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoute);

app.use('', (req, res) => {
  res.status(404).send('Página no encontrada')
})