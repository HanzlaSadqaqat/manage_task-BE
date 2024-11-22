import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoDB";
import router from "./api/routers";
import session from "cookie-session";
import passport from "passport";
import "./config/passport";
const app = express();

dotenv.config();

app.use(
  session({
    name: "session",
    keys: [process.env.SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 8080;
app.use(express.json({ limit: "100mb" }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api", router);

const appPromise = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server connected at port http://localhost:${port}`);
  });
};
appPromise();

export default app;
