import Portofolio from "@/models/portofolioModel";
import { NextRequest, NextResponse } from "next/server";
import Profits from "@/models/profitsModel"
import {connect} from "@/db/dbConfig"

connect();

export async function POST(request: NextRequest) {
    try {
    const reqBody = await request.json()
    const {id, username, exchange, coin, coinAmount, averagePrice, capital, calculatedProfits, oldCoinAmount} = reqBody
    
    const profits = (parseFloat(oldCoinAmount) * parseFloat(averagePrice)) - capital
    const totalProfits =  profits * (parseFloat(coinAmount) / parseFloat(oldCoinAmount))
    const now = new Date();
    const utc7Offset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const takeProfitsDate = new Date(now.getTime() + utc7Offset);
    const newCoinAmount = oldCoinAmount - parseFloat(coinAmount)

    // Check if a portfolio with the same exchange and coin exists
    const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });

    if (!existingPortofolio) {
        return NextResponse.json({
            message: "Portofolio not found",
            success: false,
        }, { status: 400 });
    }

    // new profits
    const newProfits = new Profits ({
        username,
        exchange,
        coin,
        coinAmount,
        averagePrice,
        takeProfitsDate,
        totalProfits,
        oldCoinAmount
    })

    const savedProfits = await newProfits.save()

    //update the portofolio
    existingPortofolio.coinAmount = newCoinAmount;
    await existingPortofolio.save();
    
    
    return NextResponse.json({
        message: "profits succesfuly added",
        sucess: true,
        savedProfits
        })


    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}