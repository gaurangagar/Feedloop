'use client'

import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import axios from 'axios'
import Link from 'next/link'
import Loading from '@/components/Loading'

const Page = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [allOrders, setAllorders] = useState(null)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('/api/orders')
        console.log(response)
        setAllorders(response.data.allorders)
      } catch (error) {
        setError(error?.response?.data?.message || 'Error in fetching all orders.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (!session || !session.user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <p className="mb-4 text-gray-700 text-lg">
          Please <Link href="/sign-in" className="text-blue-600 hover:underline">Sign-in</Link> to see all your orders.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!allOrders || allOrders.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="mb-4 text-gray-700 text-lg">
            No orders found.{' '}
            <Link href="/create-order" className="text-blue-600 hover:underline">
              Create a new order
            </Link>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allOrders.map((order) => (
        <Card key={order._id} className="shadow-md rounded-2xl p-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">
              {order.productName}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Order No: {order.orderNo}
            </p>
            {order.feedbackForm?.isFilled ? (
              <div className="space-y-2">
                <Badge variant="success">Feedback Filled</Badge>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Product Rating:</span>
                  <span className="flex">
                    {[...Array(order.feedbackForm.productRating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Shop Rating:</span>
                  <span className="flex">
                    {[...Array(order.feedbackForm.shopRating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </span>
                </div>
              </div>
            ) : (
              <Badge variant="destructive">Feedback Pending</Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default Page