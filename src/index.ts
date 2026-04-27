import express from "express";
import path from "path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";


function main() {
     const app = express();

     // ejs setup
     app.set("view engine", "ejs");
     app.set("views", path.join(__dirname, "views"));

     // built-in middleware
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));
     app.use(express.static(path.join(__dirname, "public")));

     // routes register
     app.use("/auth", authRoutes);

     // health routes
     app.get("/health", (req, res) => {
          res.send("Auth Server Running ");
     });

     app.listen(Number(env.PORT), () => {
          console.log(`Server running on http://localhost:${env.PORT}`);
     });
}

main();