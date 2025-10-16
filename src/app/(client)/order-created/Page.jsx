'use client'
export const dynamic = 'force-dynamic';
import React, { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"

function OrderCreated() {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
                <h1 className="text-2xl font-semibold text-green-600">Order successfully created</h1>
                <p className="text-gray-700">Your Order ID: {orderId}</p>
                <p className="text-gray-500">Redirect to your dashboard...</p>
            </div>
            <Link 
                href="/dashboard"
                className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Go to Dashboard
            </Link>
        </div>
    )
}

export default function page() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading order...</div>}>
            <OrderCreated/>
        </Suspense>
    )
}