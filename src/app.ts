import express from "express";
import path from "path";
import cors from "cors";
import router from "./routers/apis";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express();

dotenv.config();
const appPromise = async () => {
  const port = process.env.PORT || 8080;
  app.use(express.json({ limit: "100mb" }));
  app.use(express.static(path.join(__dirname, "../public")));
  app.use(cors());
  app.get("/demo", (_req, res) => res.status(200).send("working properly"));

  app.use("/api", router);

  await mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(() => {
      console.log("MongoDB Connection");
    });
  app.listen(port, () => {
    console.log(`Server connected at port http://localhost:${port}`);
  });
};
appPromise();

export default app;
