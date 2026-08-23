
import { Request,Response } from "express";

import { registerUser,loginUser } from "../services/authService";

export async function register(
    req:Request,
    res:Response
){
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
             return res.status(400).json({
                message: "Name, email and password are required",
            });
        }
         const user = await registerUser({
            name,
            email,
            password,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }catch(error:any){
        return res.json({
            message:error.message
        })
    }
}

export async function login(
    req:Request,
    res:Response
){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }

        const result=await loginUser({
            email,
            password
        });
        return res.status(200).json(result);
    }catch(error:any){
         return res.json({
            message:error.message
        })
    }
}

