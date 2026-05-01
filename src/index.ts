import express from "express";
import cookieParser from 'cookie-parser'
import rateLimit from "express-rate-limit";
import cors from 'cors'


import path from 'path';
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import oauthRoutes from "./routes/oauth.routes";

function main() {
     const app = express();

     // ejs setup
     app.set("views", path.join(__dirname, "views"));
     app.set("view engine", "ejs");
     app.set("trust proxy", 1);

     // built-in middleware
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));
     

     // extra middleware
     app.use(cookieParser());
     app.use(rateLimit({
          windowMs: 15 * 60 * 1000,
          max: 100,
     }))
     app.use(cors({
          origin: ["http://localhost:3000", "http://localhost:4000", "https://auth.rayvishal.dev", "https://onemillioncheckbox.rayvishal.dev"],
          credentials: true,
     }));

     // routes register
     app.use("/auth", authRoutes);
     app.use("/client", clientRoutes);
     app.use("/oauth", oauthRoutes);

     // health routes
     app.get("/health", (req, res) => {
          res.send("Auth Server Running ");
     });

     app.get('/', (req, res) => {
          res.render("index")
     })

     app.get('/login', (req, res) => {
          const redirect = req.query.redirect || "/";
          res.render("login", { redirect });
     })

     app.get('/register', (req, res) => {
          res.render('register')
     })

     app.listen(Number(env.PORT), () => {
          console.log(`Server running on http://localhost:${env.PORT}`);
     });
}

main();
