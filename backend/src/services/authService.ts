import bcrypt from "bcrypt";

import {prisma} from "../lib/prisma";

import { generateToken } from "../utils/jwt";

interface RegisterInput{
    name:string;
    email:string;
    password:string;
}

interface LoginInput{
    email:string;
    password:string;
}


export async function registerUser(input:RegisterInput){
    // endpoint is called when new user signup 
    // to create new record in the database
    const {name,email,password} =input;
    const existingUser=await prisma.user.findFirst({where:{email}});
    if(existingUser){
        throw new Error("User with email already exists");
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        },
    });
    return {
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role,
    };
}

export async function loginUser(input:LoginInput){
    //login endpoint generates tokens 
    // either when current tokens are expired or
    // when new user wants tokens
    const {email,password}=input;
    const user=await prisma.user.findFirst({
        where:{email}
    });
    if(!user){
        throw new Error("No user with such email found");
    }
    const passwordMatches=await bcrypt.compare(
        password,
        user.password
    );
    if(!passwordMatches){
        throw new Error("Invalid email or password");
    }
    const token=generateToken({
        userId:user.id,
        role:user.role,
    });
    return {
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role 
        },
    };
}

// we dont accept roles from register endpoint
// so that person does not give himself admin role

