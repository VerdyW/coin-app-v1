import Portofolio from "@/models/portofolioModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db/dbConfig"

connect();

export async function POST(request: NextRequest) {
    try {
    const reqBody = await request.json()
    const {username, exchange, coin, coinAmount, averagePrice} = reqBody
    
    // Check if a portfolio with the same exchange and coin already exists
    const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });

    if (!existingPortofolio) {
        return NextResponse.json({
            message: "Portofolio not found",
            success: false,
        }, { status: 400 });
    }

    //update portofolio
    existingPortofolio.coinAmount = coinAmount;
    existingPortofolio.averagePrice = averagePrice
    const updatedPorto = await existingPortofolio.save();
    
    return NextResponse.json({
        message: "portofolio succesfuly Updated",
        sucess: true,
        reqBody,
        updatedPorto
        })


    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}