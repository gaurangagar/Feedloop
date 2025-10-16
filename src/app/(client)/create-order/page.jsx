'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'

const Page = () => {

  const [orderId, setOrderId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setproductDescription] = useState("")
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [gstin, setGstin] = useState("");
  const [date, setDate] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter()

  const generateQuestions = async() => {
    if(!productName) {
      setMessage('Please fill the product name to generate questions.');
      return;
    }
    try{
      const response=await axios.post('/api/ques-generate',{productName,productDescription})
      const generatedQuestions=response.data.data // in array format
      setQuestions((prev) => [...prev, ...generatedQuestions]);
      setMessage('Questions generated successfully!');
    } catch(err) {
      console.log(err)
      setMessage("Error in generating questions. Please try again!")
    }
  }

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => setQuestions([...questions, ""]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(
      orderId.trim()=="" || 
      productName.trim()=="" || 
      customerName.trim()=="" || 
      customerEmail.trim()=="" || 
      orderNo.trim()=="" || 
      gstin.trim()=="" || 
      date=="" || 
      questions.some((q) => q.trim() === "")
    ) {
      alert("please fill all details and questions.")
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post('/api/orders',{orderId,productName,productDescription,customerName,customerEmail,orderNo,gstin,questions,date})
      alert("Form submitted!");
      router.push(`/order-created?orderId=${orderId}`)
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Order & Feedback Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setproductDescription(e.target.value)}
          className="w-full p-2 border rounded resize-none overflow-hidden"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Order Number"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="GSTIN"
          value={gstin}
          onChange={(e) => setGstin(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <div className="flex">
            <h2 className="font-semibold mb-2">Feedback Questions</h2>
            <button
              type="button"
              onClick={generateQuestions}
              className="ml-2 text-blue-500 underline"
            >Generate questions</button>
          </div>
          {questions.map((q, idx) => (
            <div key={idx} className="flex mb-2 gap-2">
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q}
                onChange={(e) => handleQuestionChange(idx, e.target.value)}
                className="flex-1 p-2 border rounded"
                required
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-green-500 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default Page