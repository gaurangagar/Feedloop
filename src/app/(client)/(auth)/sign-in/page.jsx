'use client'
import React, { useState, useEffect } from 'react'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
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
import Link from 'next/link';

const Page = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [credentials, setCredentials] = useState({
        email:'',
        password:''
    })
    const [error, setError] = useState('')
    const handleSubmit = async (e) => {
        if(credentials.email=='') {
            setError('Please enter your email')
        } else if(credentials.password=='') {
            setError('Please enter your password')
        } else {
            setIsLoading(true);
            try {
                const response = await axios.post('/api/auth/sign-in', {
                    email: credentials.email,
                    password: credentials.password
                });
                if (response.data.success) {
                    router.push('/dashboard')
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
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Login with your credentials or sign in with Google to continue.</CardDescription>
                    <CardAction></CardAction>
                </CardHeader>
                <CardContent>
                    {error ? <Alert variant="default | destructiv"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}
                    <form action="" onSubmit={handleSubmit}>
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
                    New here? 
                    <Link href="/sign-up">Create an account</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page