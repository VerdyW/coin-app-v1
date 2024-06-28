import {connect} from "@/db/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs";
import { error } from "console";

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {username, email, password} = reqBody


        //check if user is already exists
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if(user) {
            return NextResponse.json({error: "User Already Exist"}, {status:400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User ({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        return NextResponse.json({
            message: "user created sucessfuly",
            sucess: true,
            savedUser
        })

        


    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status:500})
    }
}