'use client'
import React, { useState, useEffect } from 'react'
import { signUp, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios';

const Page = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [credentials, setCredentials] = useState({
        name:'',
        email:'',
        password:''
    })
    const [error, setError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(credentials.email=='') {
            setError('Please enter your email')
        } else if(credentials.password=='') {
            setError('Please enter your password')
        } else if(credentials.name=='') {
            setError('Please enter Organizations Name')
        }{
            setIsLoading(true);
            try {
                const response = await axios.post('/api/auth/sign-up', {
                    email: credentials.email,
                    password: credentials.password,
                    organizationName:credentials.name
                });
                if (response.data.success) {
                    router.push('/sign-in')
                } else {
                    setError(response.data.message || 'Sign in failed');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }
        setCredentials({
            email:'',
            password:''
        })
    }
    const { data: session } = useSession();
    const router = useRouter()
    useEffect(()=>{
            if(session && session.user) {
                router.push('/dashboard')
            }
        },[session])
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md shadow-md border border-gray-200">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-semibold text-gray-900">Create Your Account</CardTitle>
                    <CardDescription className="text-gray-500 text-sm">Sign up with your email and password, or continue with Google to get started instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error ? <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
                    <form action="" onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">Organization Name</label>
                            <input 
                                type="text"
                                value={credentials.name}
                                onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder='Enter your organization name' 
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="text"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder='Enter your email address' 
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder='Enter your password'
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <button 
                                type='submit' 
                                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >Signin</button>
                        </div>
                        <div>
                            <button 
                                type='button' 
                                onClick={() => signUp("google")}
                                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                            >
                                Sign Up with Google
                            </button>
                        </div> 
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-600">
                    Already joined! 
                    <Link 
                        href="/sign-in"
                        className="text-blue-600 hover:underline"
                    >Sign-in</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page