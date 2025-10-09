import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../Components/Owner/Title'
import { useAppContext } from '../../Context/Appcontext'
import axios from 'axios'
import toast from 'react-hot-toast'


const Dashboard = () => {
    const [data,setData] = useState({
        totalCars:0,
        totalBookings:0,
        pendingBookings:0,
        completedBookings:0,
        recentBookings:[],
        monthlyRevenue:0,
    })

    const DashboardCards = [
        {title:"Total Cars",value:data.totalCars,icon:assets.carIconColored},
        {title:"Total Bookings",value:data.totalBookings,icon:assets.listIconColored},
        {title:"Pending",value:data.pendingBookings,icon:assets.cautionIconColored},
        {title:"confirmed",value:data.completedBookings,icon:assets.listIconColored}
    ]

    const {isOwner} = useAppContext();

    const fetchDashboardData = async() => {
      try {
        const {data} = await axios.get('/api/owner/dashboard')
        if(data.success) {
          setData(data.dashboardData)
        } else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    useEffect(() => {
        if(isOwner) {
          fetchDashboardData();
        }
    },[isOwner])
  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
     <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />
     <div className='grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
      {DashboardCards.map((card,index)=>(
        <div key={index} className='flex gap-2 items-center justify-between p-4 rounded-md border border-black'>
         <div>
            <h1 className='text-xs text-gray-500'>{card.title}</h1>
            <p className='text-lg font-semibold'>{card.value}</p>
         </div>
         <div className='flex items-center justify-center w-10 h-10 rounded-full bg-blue-100'>
            <img className='w-4 h-4' src={card.icon} alt="" />
         </div>
        </div>
      ))}
     </div>

     <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
      <div className='p-4 md:p-6 border border-black rounded-md max-w-lg w-full'>
       <h1 className='text-lg font-medium'>Recent Bookings</h1>
       <p className='text-gray-500'>Latest Customer Bookings</p>
       {data.recentBookings.map((booking,index)=>(
        <div key={index} className='mt-4 flex items-center justify-between'>
         <div className='flex items-center gap-2'>
          <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100'>
            <img className='w-5 h-5' src={assets.listIconColored} alt="" />
          </div>
          <div>
            <p>{booking.car.brand} {booking.car.model}</p>
            <p className='text-sm text-gray-500'>{booking.createdAt.split('T')[0]}</p>
          </div>
         </div>
         <div className='flex items-center gap-2 font-medium'>
          <p className='text-sm text-gray-500'>${booking.price}</p>
          <p className='px-3 py-0.5 border border-black rounded-full text-sm'>{booking.status}</p>
         </div>
        </div>
       ))}
      </div>
      <div className='p-4 md:p-6 mb-6 border border-black rounded-md w-full md:max-w-xs'>
      <h1 className='text-lg font-medium'>Monthly Revenue</h1>
      <p className='text-gray-500'>Revenue For Current Month</p>
      <p className='text-3xl mt-6 font-semibold text-blue-400'>${data.monthlyRevenue}</p>
      </div>
     </div>
    </div>
  )
}

export default Dashboard