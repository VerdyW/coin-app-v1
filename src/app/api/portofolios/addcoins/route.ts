import {connect} from "@/db/dbConfig"
import Portofolio from "@/models/portofolioModel"
import { NextRequest, NextResponse } from "next/server"

connect();

export async function POST(request: NextRequest) {
    try {
    const reqBody = await request.json()
    const {username, exchange, coin, coinAmount, averagePrice} = reqBody
    
    // Check if a portfolio with the same exchange and coin already exists
    const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });
    if (existingPortofolio) {
        return NextResponse.json({
            message: "Portofolio with the same exchange and coin already exists",
            success: false,
        }, { status: 400 });
    }

        const newPortofolio = new Portofolio ({
            username,
        exchange,
        coin,
        coinAmount,
        averagePrice,
        })
    
    const savedPortofolio = await newPortofolio.save()
        console.log(savedPortofolio);
    
    return NextResponse.json({
        message: "portofolio added sucessfuly",
        sucess: true,
        savedPortofolio
        })
    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}