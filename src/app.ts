import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoDB";
import router from "./api/routers";
import session from "express-session";
import passport from "passport";
import "./config/passport";
const app = express();

dotenv.config();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
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
