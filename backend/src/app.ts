import express from "express";
import cors from "cors";

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"Last Mile delivery API is running"
    });
});

export {app};