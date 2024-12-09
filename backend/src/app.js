import express from "express";
import authRoutes from "./routes/auth.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); 


export default app;