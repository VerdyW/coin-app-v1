import {connect} from "@/db/dbConfig"
import Portofolio from "@/models/portofolioModel"
import { NextRequest, NextResponse } from "next/server"

connect();

export async function POST(request: NextRequest) {
    try {
    
    const reqBody = await request.json()
    const {username} = reqBody
    const data = await Portofolio.find({ username });
    return NextResponse.json({
        message: "user found",
        data: data,
    })

    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}