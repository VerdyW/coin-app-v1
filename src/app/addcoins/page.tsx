'use client'

import { useRouter } from "next/navigation";
import React, {useState, useEffect} from "react";
import axios from "axios";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";

export default function AddCoins() {


    const router = useRouter();

    const initialState = {
        username: '',
        exchange: '',
        coin: '',
        coinAmount: '',
        averagePrice: '',
    };

    const [portofolio, setPortofolio] = useState(initialState);
    
    const [data, setData] = useState("nothing")

        useEffect(() => {
            getUserDetail();
        }, [data]);


    const getUserDetail = async () => {
        try {
            const response = await axios.get('/api/users/me');
            const username = response.data.data.username;
            setData(username);
        } catch (error) {
            console.log("token undifined or expired")
            await axios.get('/api/users/logout')
            router.push("/login")
        }
    }

    const validateInputs = () => {
        const {  exchange, coin, coinAmount, averagePrice } = portofolio;
        if ( !exchange || !coin || !coinAmount || !averagePrice) {
            alert('Please fill in all fields');
            return false;
        } 

        const coinAmountNumber = parseFloat(coinAmount);
        const averagePriceNumber = parseFloat(averagePrice);


        if (isNaN(coinAmountNumber) || isNaN(averagePriceNumber)) {
            alert('Coin amount and average price must be valid numbers');
            return false;
        }
        return true;
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
           onAddCoin();
        }
      };

    const onAddCoin = async () => {
        
       
        //validate the inputs
        if (validateInputs()) {
            
            // proceed with adding the coin logic
            console.log('All fields are filled');

            try {
                const response = await axios.post("/api/portofolios/addcoins", portofolio);
                console.log("Response received:", response); 
                alert('Portfolio added successfully');
                router.push("/home");
            } catch (error:any) {

                if (error.response && error.response.data) {
                    alert('An error occurred: Data already exist');
                } else {
                    alert('An error occurred. Please try again.');
                }
            }
        }
    };

    return(
        <div className="flex flex-col justify-center items-center h-screen bg-Secondary-50">
            <div className="flex w-2/4 max-sm:w-11/12">
                <button onClick={() => {router.push("/home")}} className="mt-5 p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl h-10 w-12 items-center flex"><ArrowNarrowLeftIcon/></button>
            </div>
            <h1 className="text-center text-Primary-950 text-4xl mb-5">Add Coins</h1>
            <h1 className="text-center text-Primary-950 text-2xl mb-5">Signup</h1>
            <hr/>
            
            <label className="text-Primary-950" htmlFor="exchange">Choose a crypto exchange:</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 h-10 w-60"
            id="exchange"
            value={portofolio.exchange}
            onChange={(e) => {setPortofolio({...portofolio, username: data, exchange: e.target.value})}}
            placeholder="exchange"
            />
            
            
            <label className="text-Primary-950" htmlFor="coin">Coin Ticker</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="coin"
                type="text"
                value={portofolio.coin}
                onChange={(e) => {setPortofolio({...portofolio, coin: e.target.value.toUpperCase()})}}
                onKeyDown={handleKeyDown}
                placeholder="coin"
                />

            <label className="text-Primary-950" htmlFor="coinAmount">Coin Amount</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="coinAmount"
                type="text"
                value={portofolio.coinAmount}
                onChange={(e) => {setPortofolio({...portofolio, coinAmount: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="coinAmount"
                />

            <label className="text-Primary-950" htmlFor="averagePrice">Average Price</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="averagePrice"
                type="text"
                value={portofolio.averagePrice}
                onChange={(e) => {setPortofolio({...portofolio, averagePrice: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="averagePrice"
                />

            <button
            onClick={onAddCoin}
            className="p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">Add Coin</button>
        </div>
    )
}