'use client'
import { useSession } from 'next-auth/react'
import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {

  const {data: session}=useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [allOrders, setAllorders] = useState({})
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const orders = await axios.get('/api/orders')
        setAllorders(Orders)
      } catch (error) {
        setError(response.data.message || 'Error in fetching all orders.')
      } finally{
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
    </> : <>{allOrders}</>
  )
}

export default Page