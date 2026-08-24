import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import pricingRoutes from "./routes/pricingRoutes";
const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"Last Mile delivery API is running"
    });
});

app.use("/api/auth",authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pricing",pricingRoutes);

export {app};


