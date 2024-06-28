'use client'

import { useRouter } from "next/navigation";
import React from "react";

export default function LoginButton() {

    const router = useRouter();

    return(
    <button onClick={() => {router.push("/login")}} className="h-12 w-48 rounded-md border-4 border-Primary-950 text-Primary-950 text-2xl font-semibold hover:text-Primary-600 hover:border-Primary-600 active:text-Third-700 active:border-Third-700 max-sm:w-1/2 max-sm:text-xl">
              Login
            </button>
    )
}