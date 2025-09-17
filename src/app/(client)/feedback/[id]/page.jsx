'use client'
import React, { useState,useEffect } from 'react'
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
const page = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({})
    useEffect(() => {
      const fetchForm=async()=>{
        try {
            setIsLoading(true)
            const response=await axios.get(`api/feedback/${id}`)
            setForm(response.data.response.form)
        } catch (error) {
            setError(error?.response?.data?.message || 'Error in fetching all orders.')
        } finally{
            setIsLoading(false)
        }
      }
      fetchForm()
    }, [])
    
  return (
      isLoading ? (
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      ) : (
        <>hello</>
      )
    )
}

export default page