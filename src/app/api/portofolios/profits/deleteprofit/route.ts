import Portofolio from "@/models/portofolioModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db/dbConfig"
import Profit from "@/models/profitsModel";
import next from "next";

connect();

export async function POST(request: NextRequest) {
    try {
    const reqBody = await request.json()
    const {username, exchange, coin, takeProfitsDate} = reqBody
    
    const existingProfit = await Profit.findOne({ username, exchange, coin, takeProfitsDate });

    const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });

    const oldCoinAmount = existingPortofolio.coinAmount + existingProfit.coinAmount

    if (!existingPortofolio) {
        return NextResponse.json({
            message: "Portofolio not found",
            success: false,
        }, { status: 400 });
    }

    // delete the profit selected
    await Profit.deleteOne({ username, exchange, coin, takeProfitsDate });

    //update portofolio coinAmount back to before taking profits
    existingPortofolio.coinAmount = oldCoinAmount; 
    await existingPortofolio.save();

    return NextResponse.json({
        message: "profits succesfuly deleted",
        sucess: true,
        })
    

    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}