import Portofolio from "@/models/portofolioModel";
import { NextRequest, NextResponse } from "next/server";
import Buy from "@/models/buyModel"
import {connect} from "@/db/dbConfig"

connect();

export async function POST(request:NextRequest) {

    try {
        const reqBody = await request.json()
        const {id, username, exchange, coin, addCoinAmount, averagePrice, oldCoinAmount, oldAveragePrice, coinFee} = reqBody
        
        const buyDate = new Date();
        
        
        // Check if a portfolio with the same exchange and coin exists
        const existingPortofolio = await Portofolio.findOne({ username, exchange, coin });
    
        if (!existingPortofolio) {
            return NextResponse.json({
                message: "Portofolio not found",
                success: false,
            }, { status: 400 });
        }
    
        //new buy
        const newBuy = new Buy ({
            username,
            exchange,
            coin,
            coinAmount : addCoinAmount,
            averagePrice,
            buyDate,
            oldCoinAmount,
            oldAveragePrice,
            coinFee
        })

        const savedBuy = await newBuy.save();

        //calculate new average and coin amount
        const newCoinAmount = parseFloat(oldCoinAmount) + (parseFloat(addCoinAmount) - parseFloat(coinFee))

        const totalOld = parseFloat(oldAveragePrice) * parseFloat(oldCoinAmount)
        const totalAdd = parseFloat(addCoinAmount) * parseFloat(averagePrice)
        const newAveragePrice = (totalOld + totalAdd) / (newCoinAmount)
        
        //update the portofolio
        existingPortofolio.coinAmount = newCoinAmount;
        existingPortofolio.averagePrice = newAveragePrice
        const updatePorotofolio = await existingPortofolio.save();

        return NextResponse.json({
            message: "profits succesfuly added",
            sucess: true,
            savedBuy,
            updatePorotofolio
            })
    
    
        } catch (error : any){
            return NextResponse.json({error: error.message}, {status:500})
        }
    
}