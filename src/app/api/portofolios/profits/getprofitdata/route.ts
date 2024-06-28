import { NextRequest, NextResponse } from "next/server";
import {connect} from "@/db/dbConfig"
import Profit from "@/models/profitsModel";

connect();

export async function POST(request: NextRequest) {
    const reqBody = await request.json()
    const {username} = reqBody

      try {
        const data = await Profit.find({ username });
        return NextResponse.json({
            message: "user found",
            data,
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}