'use client'
import React, { useState, useEffect } from 'react'
import { signUp, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardAction,
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
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Create Your Account</CardTitle>
                    <CardDescription>Sign up with your email and password, or continue with Google to get started instantly.</CardDescription>
                    <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                    {error ? <Alert variant="default | destructiv"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label>Organization Name</label>
                            <input 
                            type="text"
                            value={credentials.name}
                            onChange={(e)=>setCredentials.name(e.target.value)}
                            placeholder='Enter your organization name' />
                        </div>
                        <div>
                            <label>Email Address</label>
                            <input
                            type="text"
                            value={credentials.email}
                            onChange={(e)=>setCredentials.email(e.target.value)}
                            placeholder='Enter your email address' />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                            type="password"
                            value={credentials.password}
                            onChange={(e)=>setCredentials.password(e.target.value)}
                            placeholder='Enter your password'
                             />
                        </div>
                        <div>
                            <button type='submit'>Signin</button>
                        </div>
                        <div>
                            <button type='button' onClick={() => signIn("google")}>
                                Sign In with Google
                            </button>
                        </div> 
                    </form>
                </CardContent>
                <CardFooter>
                    Already joined! 
                    <Link href="/sign-in">Sign-in</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page