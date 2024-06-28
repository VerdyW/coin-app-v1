import axios from "axios";
import React, { useEffect, useState } from "react";
import { revalidatePath } from 'next/cache'

interface Props {
    closeModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function LoginModal({closeModal}: Props) {

    return(
        <div className="bg-slate-white bg-opacity-75 backdrop-blur-sm w-screen h-screen fixed flex justify-center place-items-center">
            <div className="flex flex-col justify-center items-center bg-Secondary-50 h-2/4 w-1/4 sm:rounded-3xl sm:border-4 sm:border-Primary-950 max-sm:w-full max-sm:h-full">
                <div className="title"> 
                    <h1 className="text-2xl font-bold mb-5">Test Environtment</h1>
                </div>
                <div className="flex flex-col"> 
                   <h2 className="text-lg"> This is a test web only and sign up is disabled </h2>
                   <h2 className="text-lg mb-5"> To login use the following credentials: </h2> 
                   <h2 className="text-lg"> Username: <span className="font-bold">test123</span> </h2> 
                   <h2 className="text-lg"> Password: <span className="font-bold">123</span> </h2>
                </div>
                <div className="footer"> 
                    <button className="text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl rounded p-2 m-5" onClick={() => {closeModal(false)}}>Close</button>
                </div>
            </div>

        </div>
    )
}