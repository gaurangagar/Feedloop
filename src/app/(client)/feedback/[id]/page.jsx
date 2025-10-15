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
    <div className="max-w-xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {isLoading ? (
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      ) : error ? (
        ErrorAlert({title:"Error in fetching form",description:error})
      ) : (
         <form 
          onSubmit={handleSubmit} 
          className="space-y-4 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex flex-col space-y-1">
            <label 
              htmlFor="productrating" 
              className="font-medium text-gray-700"
            >Product Rating :</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <span
                  key={n}
                  className={`text-2xl cursor-pointer ${productRating >= n ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setProductRating(n)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label 
              htmlFor="shoprating" 
              className="font-medium text-gray-700"
              >Shop Rating :</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <span
                  key={n}
                  className={`text-2xl cursor-pointer ${shopRating >= n ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setShopRating(n)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          {answers.map((key, ind) => (
            <div 
              key={ind} 
              className="flex flex-col space-y-1"
            >
              <label 
                htmlFor={ind} 
                className="font-medium text-gray-700"
              >{key.question}</label>
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
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        <button 
          type="submit"
          className="w-full bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600 transition"
        >Submit</button>
      </form> 
      )}
    </div>
  )
}

export default page