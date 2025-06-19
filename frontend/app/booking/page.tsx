"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

interface BookingSlot {
  day: string
  time: string
  isBooked: boolean
  bookedBy?: string
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingSlot[]>([])
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const daysChinese = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const timeSlots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
    "18:00-19:00",
    "19:00-20:00",
    "20:00-21:00",
  ]

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const email = localStorage.getItem("userEmail")

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setUserEmail(email || "")

    // 初始化预约数据
    const initialBookings: BookingSlot[] = []
    days.forEach((day) => {
      timeSlots.forEach((time) => {
        initialBookings.push({
          day,
          time,
          isBooked: false,
        })
      })
    })
    setBookings(initialBookings)
  }, [router])

  const handleBooking = (day: string, time: string) => {
    setBookings((prev) =>
      prev.map((booking) => {
        if (booking.day === day && booking.time === time) {
          if (booking.isBooked && booking.bookedBy === userEmail) {
            // 取消预约
            return { ...booking, isBooked: false, bookedBy: undefined }
          } else if (!booking.isBooked) {
            // 新预约
            return { ...booking, isBooked: true, bookedBy: userEmail }
          }
        }
        return booking
      }),
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userEmail")
    router.push("/login")
  }

  const getBookingStatus = (day: string, time: string) => {
    const booking = bookings.find((b) => b.day === day && b.time === time)
    if (!booking) return "available"
    if (booking.isBooked && booking.bookedBy === userEmail) return "my-booking"
    if (booking.isBooked) return "booked"
    return "available"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-2 md:p-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-4 md:mb-6 p-2">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            <span className="text-sm md:text-base text-gray-600 truncate max-w-[150px] md:max-w-none">{userEmail}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm md:text-base h-9 md:h-10"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">退出登录</span>
            <span className="sm:hidden">退出</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl md:text-2xl font-bold text-green-700">网球陪练预约</CardTitle>
            <div className="flex justify-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>可预约</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
                <span>我的预约</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded"></div>
                <span>已被预约</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            {/* 移动端优化的表格 */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px] border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                {/* 表头 */}
                <div className="grid grid-cols-8">
                  <div className="border-r-2 border-gray-800 p-2 md:p-3 h-14 md:h-16 font-bold text-center bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center sticky left-0 z-10 shadow-md">
                    <span className="text-xs md:text-sm font-semibold text-gray-700">时间</span>
                  </div>
                  {days.map((day, index) => (
                    <div
                      key={day}
                      className="border-r-2 border-gray-800 p-1 md:p-3 h-14 md:h-16 font-bold text-center bg-gradient-to-r from-green-100 to-green-200 last:border-r-0 flex flex-col items-center justify-center"
                    >
                      <div className="text-xs md:text-sm font-semibold text-gray-800">{day}</div>
                      <div className="text-xs text-gray-600 mt-0.5 md:mt-1">{daysChinese[index]}</div>
                    </div>
                  ))}
                </div>

                {/* 时间行 */}
                {timeSlots.map((timeSlot, timeIndex) => (
                  <div key={timeSlot} className="grid grid-cols-8 border-t-2 border-gray-800">
                    <div className="border-r-2 border-gray-800 p-1 md:p-3 h-14 md:h-16 font-semibold text-center bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center sticky left-0 z-10 shadow-md">
                      <span className="text-xs md:text-sm text-gray-700">{timeSlot}</span>
                    </div>
                    {days.map((day) => {
                      const status = getBookingStatus(day, timeSlot)
                      return (
                        <div
                          key={`${day}-${timeSlot}`}
                          className="border-r-2 border-gray-800 p-0.5 md:p-1 last:border-r-0 h-14 md:h-16 flex items-center justify-center bg-white"
                        >
                          <Button
                            onClick={() => handleBooking(day, timeSlot)}
                            variant="ghost"
                            size="sm"
                            className={`w-full h-full text-xs font-medium rounded-md transition-all duration-200 min-h-[48px] ${
                              status === "available"
                                ? "bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 hover:border-green-300 hover:shadow-md"
                                : status === "my-booking"
                                  ? "bg-green-500 hover:bg-green-600 text-white border-2 border-green-600 shadow-md"
                                  : "bg-gray-200 cursor-not-allowed text-gray-500 border-2 border-gray-300"
                            }`}
                            disabled={status === "booked"}
                          >
                            {status === "available" && (
                              <span className="flex flex-col items-center leading-tight">
                                <span className="text-xs md:text-sm">可预约</span>
                              </span>
                            )}
                            {status === "my-booking" && (
                              <span className="flex flex-col items-center leading-tight">
                                <span className="text-xs md:text-sm">✓ 已预约</span>
                              </span>
                            )}
                            {status === "booked" && (
                              <span className="flex flex-col items-center leading-tight">
                                <span className="text-xs md:text-sm">已满</span>
                              </span>
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 md:mt-6 text-center">
              <div className="inline-flex items-center justify-center gap-3 md:gap-6 p-3 md:p-4 bg-gray-50 rounded-lg flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded"></div>
                  <span className="text-sm md:text-base text-gray-700">可预约</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded"></div>
                  <span className="text-sm md:text-base text-gray-700">我的预约</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm md:text-base text-gray-700">已被预约</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-3 px-2">
                点击空白时间段进行预约，点击已预约的时间段可以取消预约
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
