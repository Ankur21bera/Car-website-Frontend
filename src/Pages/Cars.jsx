import React, { useEffect, useState } from 'react'
import Title from '../Components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../Components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../Context/Appcontext';
import toast from 'react-hot-toast';

const Cars = () => {
  const [input,setInput] = useState('');
  const [searchParams] = useSearchParams();
  const pickUpLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const isSearchData = pickUpLocation && pickupDate && returnDate
  const [filteredCars,setFilteredCars] = useState([]);

  const {cars,axios} = useAppContext();


  const searchCarAvailability = async() => {
    const {data} = await axios.post('https://car-backend-jhw4.onrender.com/api/bookings/check-availability',{location:pickUpLocation,pickupDate,returnDate});
    if(data.success) {
      setFilteredCars(data.availableCars);
      if(data.availableCars.length === 0) {
        toast.error('no cars available')
      }
      return null;
    }
  }

  const applyFilter = async() => {
    if(input === '') {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car)=>{
    return car.brand.toLowerCase().includes(input.toLowerCase())
    || car.model.toLowerCase().includes(input.toLowerCase())
    || car.category.toLowerCase().includes(input.toLowerCase())
    || car.transmission.toLowerCase().includes(input.toLowerCase())
  })
  setFilteredCars(filtered);
  }

 

  useEffect(() => {
    isSearchData && searchCarAvailability()
  },[])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  },[input,cars])
  return (
    <div>
        <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title="Available Cars" subTitle="Browse our selection of premium vehicles available for your next adventure"/>
        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
         <img className='w-4.5 h-4.5 mr-2' src={assets.search_icon} alt="" />
         <input onChange={(e)=>setInput(e.target.value)} value={input} className='w-full h-full outline-none text-gray-500' type="text" placeholder='Search by Make, Model or Feature' />
         <img className='w-4.5 h-4.5 ml-2' src={assets.filter_icon} alt="" />
        </div>
        </div>

        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
         <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

         <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car,index)=>(
            <div key={index}>
             <CarCard car={car}/>
            </div>
          ))}
         </div>
        </div>
    </div>
  )
}

export default Cars