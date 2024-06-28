'use client'
import { ArrowRightIcon } from '@heroicons/react/solid'
import Router from 'next/navigation'
import { useRouter } from 'next/navigation'
import React from 'react'

const GetStartedNavbar = () => {
  const router = useRouter();

    return (
    <div onClick={() => {router.push("/signup")}} className="flex flex-row items-center gap-4 h-full cursor-pointer  text-Primary-950 hover:text-Primary-600 active:text-Third-700">
      <h1 className='text-xl'>Get Started Now</h1>
      <div className='flex h-8'>
        <ArrowRightIcon/>
      </div>
    </div>
  )
}

export default GetStartedNavbar