import Portofolio from "@/models/portofolioModel";
import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db/dbConfig"
import Buy from "@/models/buyModel"

connect();

export async function POST(request: NextRequest) {
    try {
    const reqBody = await request.json()
    const {username, exchange, coin, buyDate, averagePrice, coinAmount} = reqBody
    
    const existingBuy = await Buy.findOne({ username, exchange, coin, buyDate });

    const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });

    if (!existingPortofolio) {
        return NextResponse.json({
            message: "Portofolio not found",
            success: false,
        }, { status: 400 });
    }

    // delete the profit selected
    await Buy.deleteOne({ username, exchange, coin, buyDate });

    // update the portofolio?
    const newAveragePrice = parseFloat(existingPortofolio.averagePrice)
    const totalCoin = parseFloat(existingPortofolio.coinAmount)
    const boughtAveragePrice = parseFloat(averagePrice)
    const coinBoughtAmount = parseFloat(coinAmount)
    const coinBeforeBought = existingBuy.oldCoinAmount
    const oldAveragePrice = ((newAveragePrice * totalCoin) - (boughtAveragePrice * coinBoughtAmount)) / coinBeforeBought;

    existingPortofolio.coinAmount = coinBeforeBought;
    existingPortofolio.averagePrice = oldAveragePrice;

    await existingPortofolio.save();

    return NextResponse.json({
        message: "buy transaction succesfuly deleted",
        sucess: true,
        oldAveragePrice
        })
    

    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}