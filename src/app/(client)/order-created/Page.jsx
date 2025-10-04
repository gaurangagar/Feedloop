'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"

function Page() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    useEffect(() => {
        if (!orderId) {
            router.replace("/dashboard") // protect from direct access
        }
    }, [orderId, router])

    if (!orderId) return null;

    return (
        <div>
            <div>
                <p>Order successfully created</p>
                <p>Your Order ID: {orderId}</p>
                <p>Redirect to your dashboard...</p>
            </div>
            <Link href="/dashboard">
                Go to Dashboard
            </Link>
        </div>
    )
}

export default Page