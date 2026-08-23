
import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET;



export interface JwtPayload{
    userId:number;
    role:string;
}

export function generateToken(payload:JwtPayload):string{
    if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"1d"});
}
