"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 检查是否已登录，如果已登录则跳转到预约页面，否则跳转到登录页面
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn) {
      router.push("/booking")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-700">网球陪练预约系统</h1>
        <p className="text-gray-600 mt-2">正在加载...</p>
      </div>
    </div>
  )
}
