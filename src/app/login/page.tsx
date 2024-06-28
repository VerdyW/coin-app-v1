'use client'
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import toast from "react-hot-toast"
import LoginModal from "../components/loginTest"
import Modal from "../components/editCoinModal"

export default function LoginPage(){
    
    const [openModal, setOpenModal] = useState(true)

    const router = useRouter();

    const [user, setUser] = React.useState({
        username: "",
        password: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const [loading, setLoading] = React.useState(false)

    const onLogin = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/users/login", user);
            toast.success("login sucess");
            const responseData = await axios.get('/api/users/me');
            const username = responseData.data.data.username;
            router.push(`/profile/${username}`)

        } catch (error: any) {
            alert("Password or Username is Wrong")
        } finally{
            setLoading(false);
        }
    } 

    useEffect(() => {
        if(user.username.length > 0 && user.password.length > 0) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          onLogin();
        }
      };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-Secondary-50">

            {openModal && <LoginModal closeModal={setOpenModal}/>}

            <h1 className="text-center text-4xl font-bold mb-5 text-Primary-950">Login</h1>
            <hr/>
            
            <label className="text-Primary-950" htmlFor="username">{loading ? "processing" : "Username"}</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-Primary-950"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => {setUser({...user, username: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="username"
                />
            
            <label className="text-Primary-950" htmlFor="password">Password</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-Primary-950"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => {setUser({...user, password: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="password"
                />

            <button
            onClick={onLogin}
            className="p-2 border bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">Log In</button>
            <Link href="/signup" className="text-Primary-950 active:text-Primary-950 hover:text-Primary-700">Go to Sign Up</Link>
        </div>
    )
}