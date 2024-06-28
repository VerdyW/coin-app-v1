'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const GetStartedButton = () => {
  
  const router = useRouter();
    return (
    <button onClick={() => {router.push("/signup")}} className="h-12 w-48 rounded-md bg-Primary-950 text-white text-2xl font-semibold hover:bg-Primary-600 active:bg-Third-700 max-sm:w-1/2 max-sm:text-xl">
              Get Started
    </button>
  )
}

export default GetStartedButton