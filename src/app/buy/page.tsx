'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownIcon, ArrowNarrowLeftIcon, ArrowUpIcon, RefreshIcon, TrashIcon } from "@heroicons/react/solid";

export default function Buy(){
    
    const router = useRouter();

    const initialState = {
        id: '',
        username: '',
        exchange: '',
        coin: '',
        addCoinAmount: '',
        averagePrice: '',
        oldCoinAmount: '',
        oldAveragePrice : '',
        coinFee: ''
    };

    const [buyArray, setBuyArray] = useState(initialState);

    const [user, setUser] = useState("nothing")

    const [mergedArray, setMergedArray] = useState([]);
    const [portofolioArray, setPortofolioArray] = useState([]);
    const [buyDataArray, setBuyDataArray] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchCoin, setSearchCoin] = useState("")
    const [filterExchange, setFilterExchange] = useState("")

        useEffect(() => {
            const fetchData = async () => {
                await getUserProfile();
            };
            fetchData();
        }, [user]);

        useEffect(() => {
            if (user !== "nothing") {
                getUserPortofolio();
                getBuyData();
            }
        }, [user]);

    const getUserProfile = async () => {
        try {
            const response = await axios.get('/api/users/me');
            const username = response.data.data.username;
            setUser(username);
        } catch (error) {
            console.log("token undifined or expired")
            await axios.get('/api/users/logout')
            router.push("/login")
        }
    }

    const getUserPortofolio = async () => {
        const resData = await axios.post('/api/portofolios/getData', {username: user})
        const portofolioArray = resData.data.data;
        setPortofolioArray(portofolioArray);
        const coinsList = portofolioArray.map((item: { coin: any; }) => item.coin);
        const uniqueCoins = Array.from(new Set(coinsList));
        const coinsInPortofolio = uniqueCoins.join(',');
        const body = {
            coins: coinsInPortofolio
        }
        try {
            const responseCMC = await axios.post('/api/portofolios/connectCMC', body)
        const cmcData = responseCMC.data.coins

            const cryptoArray = Object.keys(cmcData).map(key => {
            const crypto = cmcData[key];
            const name = crypto.name;
            const symbol = crypto.symbol;
            const currentPrice = crypto.quote.USD.price;
            const percentChange24h = crypto.quote.USD.percent_change_24h;
            const marketCap = crypto.quote.USD.market_cap;
            
      
            return {
              name: name,
              symbol: symbol,
              price: currentPrice,
              percent_change_24h: percentChange24h,
              market_cap: marketCap
            };
          });
        
        let idCounter = 0;

                const mergedArray = portofolioArray.map((portfolioItem: { coin: any; coinAmount: number; averagePrice: number; }) => {
                const cryptoData = cryptoArray.find(crypto => crypto.symbol === portfolioItem.coin);
        
                // Calculate portfolio values
            
                const currentPrice = cryptoData ? cryptoData.price : 0;
                const capital = parseFloat((portfolioItem.coinAmount * portfolioItem.averagePrice).toFixed(2));
                const currentCapital = parseFloat((portfolioItem.coinAmount * currentPrice).toFixed(2));
                const PNL = parseFloat((currentCapital - capital).toFixed(2));
                const PNLPercentage = capital !== 0 ? parseFloat(((PNL / capital) * 100).toFixed(2)) : 0;
                const moonbagStatus = PNLPercentage >= 100;
                const coinName = cryptoData ? cryptoData.name : "not found";
                return {
                    id: idCounter++,
                    ...portfolioItem,
                    coinName,
                    currentPrice,
                    percent_change_24h: cryptoData ? parseFloat(cryptoData.percent_change_24h).toFixed(2) : 0,
                    market_cap: cryptoData ? parseFloat(cryptoData.market_cap).toFixed(2) : 0,
                    capital,
                    currentCapital,
                    PNL,
                    PNLPercentage,
                    moonbagStatus
                        };
                });
        
        setMergedArray(mergedArray);
        } catch (error) {
            console.log("no item in portofolio")
        }
    }

    const buy = async () => {
        if (validateInputs()){
            const res = await axios.post('/api/portofolios/buy', buyArray)
            router.push("/home")
        }
    }

    const validateInputs = () => {
        const {  exchange, coin, addCoinAmount, averagePrice } = buyArray;
        if ( !exchange || !coin || !addCoinAmount || !averagePrice) {
            alert('Please fill in all fields');
            return false;
        } 
        
        const coinAmountNumber = parseFloat(addCoinAmount);
        const averagePriceNumber = parseFloat(averagePrice);


        if (isNaN(coinAmountNumber) || isNaN(averagePriceNumber)) {
            alert('Coin amount and average price must be valid numbers');
            return false;
        }


    return true;
  };

  const handleCoinChange = (e) => {
    const selectedCoin = e.target.value;
    const selectedPortfolio = mergedArray.find(p => p.coin === selectedCoin && p.exchange === buyArray.exchange );
    if (selectedPortfolio) {
      setBuyArray({ ...buyArray, coin: selectedCoin, id: selectedPortfolio.id, oldCoinAmount: parseFloat(selectedPortfolio.coinAmount).toFixed(5), oldAveragePrice: selectedPortfolio.averagePrice},);
    }
  };

    const filteredCoins = mergedArray.filter(portfolio => portfolio.exchange === buyArray.exchange);

    const getBuyData = async () => {
        const res = await axios.post('/api/portofolios/buy/getbuydata', {username: user})
        let idCounter = 0;
        const dataWithIds = res.data.data.map((item: any) => {
            return { ...item, id: idCounter++ };
        });
        setBuyDataArray(dataWithIds);
    }

    const sortArray = (key: any) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedArray = [...buyDataArray].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setBuyDataArray(sortedArray);
    };

    const getSortIcon = (key: any) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                return <ArrowUpIcon className="w-4 h-4 inline-block ml-1" />;
            } else {
                return <ArrowDownIcon className="w-4 h-4 inline-block ml-1" />;
            }
        }
        return null;
    };

    const filteredArray = buyDataArray.filter((item : any) => {
        const matchesCoin = item.coin.toLowerCase().includes(searchCoin.toLowerCase());
        const matchesExchange = filterExchange === "" || item.exchange.toLowerCase() === filterExchange.toLowerCase();
        return matchesCoin && matchesExchange;
    });

    const getColumnKey = async (key : any) => {
        const selectedItem = filteredArray.find(obj => obj.id === key);
        
        const username = user
        const exchange = selectedItem.exchange;
        const coin = selectedItem.coin
        const buyDate = selectedItem.buyDate.replace("Z", "") + "+00:00"
        const averagePrice = selectedItem.averagePrice
        const coinAmount = selectedItem.coinAmount
        const deleteColumn = {
            username: username,
            exchange: exchange,
            coin: coin,
            buyDate: buyDate,
            averagePrice: averagePrice,
            coinAmount: coinAmount
        }
        const res = await axios.post('/api/portofolios/buy/deletebuy', deleteColumn)

        getBuyData();
    }

    function formatDate(dateString) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZoneName: 'short', // Include time zone abbreviation
            timeZone: 'Asia/Bangkok', // Set the time zone explicitly
        };
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', options).replace(',', '');
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          buy();
        }
      };
    
    return (
    <div className="w-screen min-h-screen bg-Secondary-50">
        <div className="flex flex-col justify-center w-screen bg-Secondary-50">
            <div className="flex flex-col justify-center items-center">

                <div className="flex w-2/4 max-sm:w-11/12">
                    <button onClick={() => {router.push("/home")}} className="mt-5 p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl h-10 w-12 items-center flex"><ArrowNarrowLeftIcon/></button>
                </div>
                <h1 className="text-center text-Primary-950 text-4xl mb-5">Buy Transaction</h1>
                <hr/>
                
                <label className="text-Primary-950"  htmlFor="exchange">Choose a crypto exchange:</label>
                <select
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 h-10 w-60"
                id="username"
                value={buyArray.exchange}
                onChange={(e) => {setBuyArray({...buyArray, username: user, exchange: e.target.value})}}>
                    <option value="">Select an exchange</option>
                    <option value="Bitget">Bitget</option>
                    <option value="Binance">Binance</option>
                    <option value="Bybit">Bybit</option>
                    <option value="Kucoin">Kucoin</option>
                    <option value="Tokocrypto">Tokocrypto</option>
                </select>
                
                <label className="text-Primary-950" htmlFor="coin">Coin</label>
                <select
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 h-10 w-60"
                    id="coin"
                    value={buyArray.coin}
                    onChange={handleCoinChange}>
                    <option value="">Select a coin</option>
                    {filteredCoins.map((portfolio, index) => (
                        <option key={index} value={portfolio.coin}>
                            {portfolio.coin}
                        </option>
                    ))}
                </select>

                <label className="text-Primary-950" htmlFor="coinAmount">Coin Amount</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    id="coinAmount"
                    type="text"
                    value={buyArray.addCoinAmount}
                    onChange={(e) => {setBuyArray({...buyArray, addCoinAmount: e.target.value})}}
                    onKeyDown={handleKeyDown}
                    placeholder="coinAmount"
                    />

                <label className="text-Primary-950" htmlFor="averagePrice">Average Price</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    id="averagePrice"
                    type="text"
                    value={buyArray.averagePrice}
                    onChange={(e) => {setBuyArray({...buyArray, averagePrice: e.target.value})}}
                    onKeyDown={handleKeyDown}
                    placeholder="averagePrice"
                    />

                <label className="text-Primary-950" htmlFor="coinFee">Coin Fee</label>
                <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    id="coinFee"
                    type="text"
                    value={buyArray.coinFee}
                    onChange={(e) => {setBuyArray({...buyArray, coinFee: e.target.value})}}
                    onKeyDown={handleKeyDown}
                    placeholder="coinFee"
                    />

                <button
                onClick={buy}
                className="p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">Add Transaction</button>

                <div className="flex flex-col justify-center w-10/12 max-sm:w-11/12">
                    <div className="flex mb-5 justify-between w-full gap-5">
                        <input 
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 h-10 w-1/2"
                            type="text"
                            value={searchCoin}
                            onChange={(e) => setSearchCoin(e.target.value)}
                            placeholder="Search Coin"
                        />
                        <select
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 h-10 w-1/2"
                            id="exchange"
                            value={filterExchange}
                            onChange={(e) => setFilterExchange(e.target.value)}
                        >
                            <option value="">Select an exchange</option>
                            <option value="Bitget">Bitget</option>
                            <option value="Binance">Binance</option>
                            <option value="Bybit">Bybit</option>
                            <option value="Kucoin">Kucoin</option>
                            <option value="Tokocrypto">Tokocrypto</option>
                        </select>
                    </div>
                    {filteredArray.length > 0 && (
                        <div className="flex w-full justify-start mb-4 overflow-x-auto max-sm:overflow-x-auto">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr className="bg-Primary-950 text-white">
                                        <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('coin')}>
                                            Coin {getSortIcon('coin')}
                                        </th>
                                        <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('exchange')}>
                                            Exchange {getSortIcon('exchange')}
                                        </th>
                                        <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('coinAmount')}>
                                            Coin Amount {getSortIcon('coinAmount')}
                                        </th>
                                        <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('averagePrice')}>
                                            Average Price {getSortIcon('averagePrice')}
                                        </th>
                                        <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('buyDate')}>
                                            Sell Date {getSortIcon('buyDate')}
                                        </th>
                                        <th className="px-4 py-2 lg:flex lg:items-center lg:justify-center max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={getBuyData}>
                                        <RefreshIcon className="max-sm:w-6 max-sm:h-8 w-6 h-10"/>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredArray.map((item : any) => (
                                        <tr key={item.id} className="bg-Primary-50 text-black odd:bg-white">
                                            <td className="border border-black px-4 py-2 max-sm:px-2 max-sm:py-1">{item.coin}</td>
                                            <td className="border border-black px-4 py-2 max-sm:px-2 max-sm:py-1">{item.exchange.toUpperCase()}</td>
                                            <td className="border border-black px-4 py-2 max-sm:px-2 max-sm:py-1">{item.coinAmount.toLocaleString({ maximumFractionDigits: 3 })}</td>
                                            <td className="border border-black px-4 py-2 max-sm:px-2 max-sm:py-1">{item.averagePrice.toLocaleString({ maximumFractionDigits: 6 })}</td>
                                            <td className="border border-black px-4 py-2 max-sm:px-2 max-sm:py-1">{formatDate(item.buyDate)}</td>
                                            <td className="border border-black px-4 py-2 lg:flex lg:items-center lg:justify-center max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => getColumnKey(item.id)}><TrashIcon className="max-sm:w-6 max-sm:h-8 w-6 h-10"/></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
}