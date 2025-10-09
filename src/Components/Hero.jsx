import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../Context/Appcontext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [pickupLocation,setPickupLocation] = useState('');
    const {pickupDate,setPickupDate,returnDate,setReturnDate} = useAppContext();
    const navigate = useNavigate();

    const handleSearch = (e) => {
      e.preventDefault();
      navigate(
  `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
);

    }
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-gray-50 text-center'>
     <h1 className='text-4xl md:text-5xl font-semibold'>Luxury Cars On Rent.</h1>
     <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>
      <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
       <div className='flex flex-col items-start gap-2'>
        <select required value={pickupLocation} onChange={(e)=>setPickupLocation(e.target.value)}>
            <option value="">Pickup Location</option>
            {cityList.map((city)=> <option key={city} value={city}>{city}</option> )}
        </select>
        <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : "Please Select Location"}</p>
       </div>
       <div className='flex flex-col items-start gap-2'>
        <label htmlFor="pickup-date">Pick-up Date</label>
        <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} required className='text-sm text-gray-500' type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} />
       </div>
        <div className='flex flex-col items-start gap-2'>
        <label htmlFor="return-date">Return Date</label>
        <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} className='text-sm text-gray-500' type="date" id='return-date' required/>
       </div>
       </div>
       <button className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-blue-600 hover:bg-blue-400 text-white rounded-full cursor-pointer'>
        <img className='brightness-300' src={assets.search_icon} alt="" />
        Search
       </button>
     </form>
     <img className='max-h-74' src={assets.main_car} alt="" />
    </div>
  )
}

export default Hero