import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
    
    const reqBody = await request.json()
    const {coins} = reqBody
    

    const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', 
        {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY,
            },
            params: {
                symbol: coins,
                convert: 'USD'
            }
        }
    );

    return NextResponse.json({
        message: "coins found",
        coins: response.data.data,
    })

    } catch (error : any){
        return NextResponse.json({error: error.message}, {status:500})
    }
}