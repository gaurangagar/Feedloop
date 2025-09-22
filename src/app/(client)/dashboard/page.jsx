'use client'
import { useSession } from 'next-auth/react'
import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import Link from 'next/link'

const Page = () => {

  const {data: session}=useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [allOrders, setAllorders] = useState(null)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('/api/orders')
        setAllorders(response.data.response.allorders)
      } catch (error) {
        setError(error?.response?.data?.message || 'Error in fetching all orders.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])
  
  return (
    (!session || !session.user) ? <>
      <div>Please 
        <Link href="/sign-in">Sign-in</Link>
         to see all your orders.</div>
    </> : (
      isLoading ? (
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      ) : (
        <>{allOrders}</>
      )
    )
  )
}

export default Page