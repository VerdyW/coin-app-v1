'use client'

import { useRouter } from "next/navigation"
import React, {useState, useEffect} from "react";
import axios from "axios";
import { ArrowUpIcon, ArrowDownIcon, TrashIcon, RefreshIcon, PencilAltIcon } from '@heroicons/react/solid';
import Modal from '@/app/components/editCoinModal'

export default function Home(){
    
    const router = useRouter();

    const profile = async () => {
        try {
            const responseData = await axios.get('/api/users/me');
            const username = responseData.data.data.username;
            router.push(`/profile/${username}`)
        } catch (error) {
            console.log("token undifined or expired")
            await axios.get('/api/users/logout')
            router.push("/login")
        }
    }

    const [user, setUser] = useState("nothing")
    const [username, setUsername] = useState({
        username: ''
    })
    const [portofolioArray, setPortofolioArray] = useState([]);
    const [mergedArray, setMergedArray] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchCoin, setSearchCoin] = useState("")
    const [filterExchange, setFilterExchange] = useState("")
    const [coulumnDelete, setColumnDelete] = useState({
        username: '',
        exchange: '',
        coin: '',
    })

    const [openModal, setOpenModal] = useState(false)
    const [editCoinData, setEditCoinData] = useState([])
    const [totalFloatingPNL, setTotalFloatingPNL] = useState("loading")

    useEffect(() => {
        const fetchData = async () => {
            await getUserDetail();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (user !== "nothing") {
            setUsername({ username: user });
        }
    }, [user]);

    useEffect(() => {
        if (username.username) {
            getUserPortofolioData();
        }
    }, [username]);

    useEffect(() => {
        calculatePNL();
    }, [filterExchange, searchCoin, mergedArray])

    const getUserDetail = async () => {
        try {
            const response = await axios.get('/api/users/me');
            setUser(response.data.data.username);    
        } catch (error) {
            console.log("token undifined or expired")
            await axios.get('/api/users/logout')
            router.push("/login")
        }
    }

    const getUserPortofolioData = async () => {
        const resData = await axios.post('/api/portofolios/getData', username)
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

    const sortArray = (key: any) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedArray = [...mergedArray].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setMergedArray(sortedArray);
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

    const filteredArray = mergedArray.filter((item : any) => {
        const matchesCoin = item.coin.toLowerCase().includes(searchCoin.toLowerCase());
        const matchesExchange = filterExchange === "" || item.exchange.toLowerCase() === filterExchange.toLowerCase();
        return matchesCoin && matchesExchange;
    });

    const getColumnKey = async (key : any) => {

        const selectedItem = filteredArray.find(obj => obj.id === key);

        const username = user
        const exchange = selectedItem.exchange;
        const coin = selectedItem.coin
        const deleteColumn = {
            username: username,
            exchange: exchange,
            coin: coin
        }

        console.log(deleteColumn)

        const res = await axios.post('/api/portofolios/deletecoin', deleteColumn)

        getUserPortofolioData();
    }

    const calculatePNL = () => {
        const total = mergedArray.reduce((acc, item) => acc + item.PNL, 0)
        setTotalFloatingPNL(total.toFixed(2));
    }
    
    const editCoin = async (key : any) => {
        const selectedItem = filteredArray.find(obj => obj.id === key);
        setEditCoinData(selectedItem)
        setOpenModal(true)
    }

    
    return (
    <div className="bg-Secondary-50 min-h-screen min-w-screen">
        <div className="flex flex-col items-center w-screen">
            <button onClick={profile} className="mt-5 p-2 border border-blue-300 rounded-lg mb-4 focus:outline-none text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl ">Profile</button>
            
            <h1 className="text-lg font-bold">Your current floating PNL</h1>
            <h2 className={`text-2xl font-bold ${totalFloatingPNL === 'loading' || totalFloatingPNL === '0.00' ? 'text-black' : `${parseFloat(totalFloatingPNL) >= 0 ? 'text-green-500' : 'text-red-500'}`}`} >{totalFloatingPNL === '0.00' ? 'loading' : totalFloatingPNL}</h2>

            <div className="flex items-center justify-center w-full h-full gap-5">
                <button onClick={() => {router.push("/addcoins")}} className=" flex items-center justify-center mt-5 p-2 w-1/6 h-14 rounded-lg mb-4 text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl ">Add Coins</button>
                <button onClick={() => {router.push("/sell")}} className="mt-5 p-2 w-1/6 h-14 rounded-lg mb-4 text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl ">Sell</button>
                <button onClick={() => {router.push("/buy")}} className="mt-5 p-2 w-1/6 h-14 rounded-lg mb-4 text-white bg-Primary-950 active:bg-Primary-950 hover:bg-Primary-700 text-xl ">Buy</button>
            </div>         
            <div className="flex flex-col justify-center items-center w-10/12 h-full max-sm:w-11/12 max-sm:h-full">
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
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer w-40" onClick={() => sortArray('coinName')}>
                                    Coin Name {getSortIcon('coinName')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('coin')}>
                                    Ticker {getSortIcon('coin')}
                                </th>
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('currentPrice')}>
                                    Current Price {getSortIcon('currentPrice')}
                                </th>
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('percent_change_24h')}>
                                    24h Change (%) {getSortIcon('percent_change_24h')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('coinAmount')}>
                                    Coin Amount {getSortIcon('coinAmount')}
                                </th>
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('averagePrice')}>
                                    Average Price {getSortIcon('averagePrice')}
                                </th>
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('capital')}>
                                    Capital {getSortIcon('capital')}
                                </th>
                                <th className="hidden sm:table-cell px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('currentCapital')}>
                                    Current Capital {getSortIcon('currentCapital')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('PNL')}>
                                    PNL {getSortIcon('PNL')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('PNLPercentage')}>
                                    PNL (%) {getSortIcon('PNLPercentage')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('exchange')}>
                                    Exchange {getSortIcon('exchange')}
                                </th>
                                <th className="px-4 py-2 max-sm:px-2 max-sm:py-1 cursor-pointer" onClick={() => sortArray('moonbagStatus')}>
                                    100% {getSortIcon('moonbagStatus')}
                                </th>
                                <th className="px-6 py-1 max-sm:px-5 max-sm:py-1 cursor-pointer" onClick={getUserPortofolioData}>
                                    <RefreshIcon className="max-sm:w-6 max-sm:h-8 w-6 h-10"/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArray.map((item : any) => (
                                <tr key={item.id} className="bg-Primary-50 text-black odd:bg-white">
                                    <td className="hidden sm:table-cell w-40 border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">{item.coinName}</td>
                                    <td className="border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">{item.coin}</td>
                                    <td className="hidden sm:table-cell border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">${item.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 3 })}</td>
                                    <td className="hidden sm:table-cell border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">{item.percent_change_24h.toLocaleString()}%</td>
                                    <td className="border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">{item.coinAmount.toLocaleString()}</td>
                                    <td className="hidden sm:table-cell border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">${item.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                                    <td className="hidden sm:table-cell border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">${item.capital.toLocaleString()}</td>
                                    <td className="hidden sm:table-cell border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">${item.currentCapital.toLocaleString()}</td>
                                    <td className={`border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1 ${item.PNL >= 0 ? 'text-green-500' : 'text-red-500'}`}>${item.PNL.toLocaleString()}</td>
                                    <td className={`border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1 ${item.PNLPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>{item.PNLPercentage.toLocaleString()}%</td>
                                    <td className="border border-Third-950 px-4 py-2 max-sm:px-2 max-sm:py-1">{item.exchange.toUpperCase()}</td>
                                    <td className={`border border-Third-950 px-4 py-2 ${item.moonbagStatus ? 'font-bold text-green-500' : ''}`}>{item.moonbagStatus ? 'Yes' : 'No'}</td>
                                    <td className="border border-Third-950 px-2 py-1 max-sm:px-2 max-sm:py-1">
                                        <div className="flex gap-1">
                                        <PencilAltIcon  className="max-sm:w-6 max-sm:h-8 cursor-pointer" onClick={() => editCoin(item.id)}/>
                                        <TrashIcon onClick={() => getColumnKey(item.id)} className="max-sm:w-6 max-sm:h-8 cursor-pointer"/>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
            {openModal && <Modal closeModal={setOpenModal} coinData={editCoinData} username={user} getUserPortofolioData={getUserPortofolioData}/>}
        </div>
    </div>
    )
}