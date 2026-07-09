import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRoute } from "./modules/category/category.route";
import { providerGearRoute } from "./modules/gear/gear.route";
import { publicGearRoute } from "./modules/gear/publicGear.route";
import { paymentRoute } from "./modules/payments/payment.route";
import { providerOrderRoute } from "./modules/providerOrders/providerOrder.route";
import { rentalRoute } from "./modules/rentals/rental.route";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Gearup Service!");
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/provider/gear", providerGearRoute);
app.use("/api/provider/orders", providerOrderRoute);
app.use("/api/gear", publicGearRoute);
app.use("/api/rentals", rentalRoute);
app.use("/api/payments", paymentRoute);

export default app;
