import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4">
            <Skeleton className="h-6 w-3/4 rounded-full animate-pulse" />
            <Skeleton className="h-4 w-full rounded-full animate-pulse" />
            <Skeleton className="h-4 w-5/6 rounded-full animate-pulse" />
            <Skeleton className="h-10 w-full rounded-lg animate-pulse" />
        </div>
    </div>
  )
}

export default Loading