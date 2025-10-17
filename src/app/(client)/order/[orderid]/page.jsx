'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'
import Loading from '@/components/Loading'
import Link from "next/link"

export default function page() {
    const router = useRouter()
    const { orderid } = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [order, setOrder] = useState({})
    const [form,setForm]=useState([])

    useEffect(() => {
        const fetchOrder=async()=>{
            try {
                setIsLoading(true)
                const response=await axios.get(`/api/orders/${orderid}`)
                console.log(response.data.feedbackForm.answers)
                setOrder(response.data.order)
                setForm(response.data.feedbackForm.answers)
            } catch (error) {
                console.error("Error fetching order:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrder()
        
    }, [orderid, router])

    if(isLoading) {
        return (
            <Loading />
        )
    }
    if(!isLoading && !form) {
        return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="mb-4 text-gray-700 text-lg">
                No such order found.{' '}
                <Link href="/create-order" className="text-blue-600 hover:underline">
                Create a new order.
                </Link>
            </p>
            </div>
        </div>
        )
    }

    return (
        <div>
            <form className="space-y-4">
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Id</label>
                    <input
                        type="text"
                        placeholder="Order ID"
                        value={order.orderId}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={order.productName}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea
                        placeholder="Product Description"
                        value={order.productDescription}
                        className="w-full p-2 border rounded resize-none overflow-hidden"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                    <input
                        type="email"
                        placeholder="Customer Email"
                        value={order.customeremail}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                    <input
                        type="text"
                        placeholder="Order Number"
                        value={order.orderNo}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                    <input
                        type="text"
                        placeholder="GSTIN"
                        value={order.gstin}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div className="flex mb-2 gap-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                    <input
                        type="date"
                        value={order.date ? new Date(order.date).toISOString().split('T')[0] : ''}
                        className="w-full p-2 border rounded"
                        disabled
                    />
                </div>
                <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Feedback Questions</h2>
                </div>
                {form?.map((q, idx) => (
                    <div key={idx} className="flex mb-2 gap-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{q.question}</label>
                        <input
                            type="text"
                            //placeholder={`Question ${idx + 1}`}
                            value={q.answer}
                            className="flex-1 p-2 border rounded"
                            disabled
                        />
                    </div>
                ))}
                </div>
                
            </form>
        </div>
    )
}