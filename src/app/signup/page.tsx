'use client'
import Link from "next/link"
import React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import toast from "react-hot-toast"

export default function SignupPage(){
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);

    const [loading, setLoading] = React.useState(false)

    const onSignup = async () => {
        try {
            setLoading(true);
            // const response = await axios.post("/api/users/signup", user);
            
            router.push("/login")
        } catch (error: any) {
            alert("Username or Email already used!")

            setLoading(false)
        } finally{

        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [user])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          onSignup();
        }
      };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-Secondary-50">
            <h1 className="text-center text-4xl font-bold mb-5 text-Primary-950">{loading ? "Processing" : "Signup"}</h1>
            <hr/>
            
            <label className="text-Primary-950 hover:text-Primary-700" htmlFor="username">Username</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => {setUser({...user, username: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="username"
                />
            
            <label className="text-Primary-950 hover:text-Primary-700" htmlFor="email">Email</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => {setUser({...user, email: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="email"
                />
            
            <label className="text-Primary-950 hover:text-Primary-700" htmlFor="password">Password</label>
            <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => {setUser({...user, password: e.target.value})}}
                onKeyDown={handleKeyDown}
                placeholder="password"
                />

            <button
            onClick={onSignup}
            className="p-2 bg-Primary-950 text-white rounded-lg mb-4 focus:outline-none active:bg-Primary-950 hover:bg-Primary-700 text-xl">{buttonDisabled ? "Signup" : "Signup"}</button>
            <Link href="/login" className="text-Primary-950 active:text-Primary-950 hover:text-Primary-700">Go to Login</Link>
        </div>
    )
}