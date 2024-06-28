'use client'

import axios from "axios"
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"

export default function UserProfilePage({params}: any) {
    
    const router = useRouter();

    const [data, setData] = useState("nothing")

    useEffect(() => {
        getUserDetail();
    }, [data]);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout')
            router.push('/login')
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const getUserDetail = async () => {
        try {
            const response = await axios.get('/api/users/me');
            setData(response.data.data.username);
        } catch (error) {
            console.log("token undifined or expired")
            await axios.get('/api/users/logout')
            router.push("/login")
        }
        
    }

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-Secondary-50">
            <h1 className="text-5xl font-bold mb-5">Profile</h1>
            <div className="flex flex-col items-center justify-center">
                <p>Welcome!</p>
                <h2 className="text-4xl">{data === 'nothing' ? "Loading" : <Link href={`/profile/${data}`}>{data} </Link>}</h2>
            </div>
            <div className="flex justify-center">
                <img src="/profile-pic.jpg" className=" max-sm:w-3/6 w-1/6 mt-5 border-4 border-blue-700"></img>
                <h1 className="absolute text-[10px] text-white self-end mb-2"><Link href="https://www.freepik.com/free-vector/cute-shiba-inu-dog-sitting-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-flat_81707590.htm#query=shiba%20inu&position=2&from_view=keyword&track=ais_user&uuid=071aade3-2150-40b2-80fd-eac9ac2a1ea4" passHref={true}>Image by catalyststuff</Link> on Freepik</h1>
            </div>
            <div className="flex items-center justify-center gap-10">
                <button onClick={logout} className="mt-5 p-2 border bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">logout</button>
                <button onClick={() => {router.push("/home")}} className="mt-5 p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">Home</button>
            </div>
        </div>
    )
}