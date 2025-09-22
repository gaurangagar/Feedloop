'use client'
import React, { useState,useEffect } from 'react'
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
import ErrorAlert from "@/components/ErrorAlert"
import axios from 'axios';

const page = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({})
    const [answers, setAnswers] = useState([])
    const [shopRating, setShopRating] = useState(null)
    const [productRating, setProductRating] = useState(null)

    useEffect(() => {
      const fetchForm=async()=>{
        try {
            setIsLoading(true)
            const response=await axios.get(`/api/feedback/${id}`)
            console.log(response)
            setForm(response.data.form)
            setAnswers(response.data.form.answers)
        } catch (error) {
          console.log(error)
          setError(error?.response?.data?.message || 'Error in fetching feedback form.')
        } finally{
            setIsLoading(false)
        }
      }
      fetchForm()
    }, [])

    const handleSubmit = async (e) => {
      e.preventDefault();
      if(shopRating==null || productRating==null) {alert('Please fill out all questions.');return}
      const finalAnswers=[];
      {answers.map((key, ind) => {
        if(key.answer=="") {alert('Please fill out all questions.');return}
        finalAnswers.push(key.answer.trim())
      })}
      try {
        const response=await axios.post(`/api/feedback/${id}`,{answers:finalAnswers,productRating,shopRating})
        console.log("Submitted answers:", answers);
        alert("Form submitted!");
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    };
    
  return (
    <div>
      {isLoading ? (
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      ) : error ? (
        ErrorAlert({title:"Error in fetching form",description:error})
      ) : (
         <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productrating">product rating</label>
            <input 
            type="number"
            onChange={(e)=>setProductRating(e.target.value)}
            value={productRating ?? ""}
            min={1}
            max={5}
            required/>
          </div>
          <div>
            <label htmlFor="shoprating">shop rating</label>
            <input 
            type="number"
            onChange={(e)=>setShopRating(e.target.value)}
            value={shopRating ?? ""}
            min={1}
            max={5}
            required/>
          </div>
          {answers.map((key, ind) => (
            <div key={ind}>
              <label htmlFor={ind}>{key.question}</label>
              <input
              id={ind} 
              type="text"
              value={answers[ind].answer || ""}
              onChange={(e) => {
                setAnswers(prev =>
                  prev.map((item, idx) =>
                    idx === ind ? { ...item, answer: e.target.value } : item
                  )
                );
              }}
              required/>
            </div>
          ))}
        <button type="submit">Submit</button>
      </form>
        
      )}
    </div>
  )
}

export default page