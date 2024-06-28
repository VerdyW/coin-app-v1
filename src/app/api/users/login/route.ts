import {connect} from "@/db/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs";
import { error } from "console";
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {

        const reqBody = await request.json()
        const {username, password} = reqBody;

        //check if user is exists
        const user = await User.findOne({username})
        if(!user){
           return NextResponse.json({error: "User doesnt exist"}, {status:400})
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Wrong password"}, {status:400})
        }

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        } 

        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1h"})

        const response =  NextResponse.json({
            message: "Login successful",
            success: true,
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status:500})
    }

    

}