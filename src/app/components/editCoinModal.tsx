import axios from "axios";
import React, { useEffect, useState } from "react";
import { revalidatePath } from 'next/cache'

export default function Modal({closeModal, coinData, username, getUserPortofolioData}) {

    const initialState = {
        username: '',
        exchange: '',
        coin: '',
        coinAmount: '',
        averagePrice: '',
    };

    const [editPortofolio, setEditPortofolio] = useState(initialState);

    useEffect(() => {
        setEditPortofolio(prevState => ({
            ...prevState,
            username: username,
            exchange: coinData.exchange,
            coin: coinData.coin
        }));
    }, [username]);

    const editData = async () => {
        const res = await axios.post('api/portofolios/editportofolio', editPortofolio)
        getUserPortofolioData();
        closeModal(false)
        // refetch data
    }

    return(
        <div className="bg-slate-white bg-opacity-75 backdrop-blur-sm w-screen h-screen fixed flex justify-center place-items-center">
            <div className="flex flex-col justify-center items-center bg-Secondary-50 h-3/4 w-1/4 sm:rounded-3xl sm:border-4 sm:border-Primary-950 max-sm:w-full max-sm:h-full">
                <div className="title"> 
                    <h1 className="text-2xl font-bold mb-5">Edit Coin</h1>
                </div>
                <div className="flex flex-col"> 
                    <label htmlFor="coin">Exchange</label>
                    <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="exchange"
                        type="text"
                        value={coinData.exchange}
                        // onKeyDown={handleKeyDown}
                        placeholder= {coinData.exchange}
                        readOnly
                        />

                    <label htmlFor="coin">Coin Ticker</label>
                    <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="coin"
                        type="text"
                        value={coinData.coin}
                        // onKeyDown={handleKeyDown}
                        placeholder={coinData.coin}
                        readOnly
                        />

                    <label htmlFor="coinAmount">Coin Amount</label>
                    <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="coinAmount"
                        type="text"
                        value={editPortofolio.coinAmount}
                        onChange={(e) => {setEditPortofolio({...editPortofolio, coinAmount: e.target.value})}}
                        // onKeyDown={handleKeyDown}
                        placeholder={coinData.coinAmount}
                        />

                    <label htmlFor="averagePrice">Average Price</label>
                    <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        id="averagePrice"
                        type="text"
                        value={editPortofolio.averagePrice}
                        onChange={(e) => {setEditPortofolio({...editPortofolio, averagePrice: e.target.value})}}
                        // onKeyDown={handleKeyDown}
                        placeholder={coinData.averagePrice}
                        />
                </div>
                <div className="footer"> 
                    <button className="text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl rounded p-2 m-5" onClick={() => {closeModal(false)}}>Cancel</button>
                    <button className="text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl rounded p-2 m-5" onClick={editData}>Continue</button>
                </div>
            </div>

        </div>
    )
}