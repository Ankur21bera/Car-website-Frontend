import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../Components/Loader";
import { useAppContext } from "../Context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";

const Cardetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const {cars,pickupDate,setPickupDate,returnDate,setReturnDate,token} = useAppContext();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post('/api/booking/create',{
        car:id,
        pickupDate,
        returnDate
      },{
         headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
      })
      if(data.success) {
        toast.success("Car Booked Successfully")
        navigate('/my-bookings')
      } else{
        toast.success("Car Is Already Book Please Try Another Date")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setCar(cars.find((car) => car._id === id));
  }, [cars,id]);
  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <img className="rotate-180 opacity-65" src={assets.arrow_icon} alt="" />
        Back To Home Page
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <img
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
            src={car.image}
            alt=""
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} {car.year}
              </p>
            </div>
            <hr className="border border-black my-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity}Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  className="flex flex-col items-center bg-gray-300 p-4 rounded-lg"
                  key={text}
                >
                  <img className="h-5 mb-2" src={icon} alt="" />
                  {text}
                </div>
              ))}
            </div>
            <div>
              <h1 className="text-xl font-medium mb-2">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>
            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 Camers",
                  "Bluetooth",
                  "GPS",
                  "Heated Seats",
                  "Rear View Mirror",
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <img className="h-4 mr-2" src={assets.check_icon} alt="" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500">
         <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">₹{car.pricePerDay} <span className="text-base text-gray-400 font-normal">Per Day</span> </p>
         <hr className="border-black my-6" />
         <div className="flex flex-col gap-2">
          <label htmlFor="pickup-date">Pickup Date</label>
          <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} type="date" className="border border-black px-3 py-2 rounded-lg" required id="pickup-date" min={new Date().toISOString().split('T')[0]} />
         </div>
         <div className="flex flex-col gap-2">
          <label htmlFor="return-date">Return Date</label>
          <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} type="date" className="border border-black px-3 py-2 rounded-lg" required id="return-date"/>
         </div>
         <button className="w-full bg-blue-600 hover:bg-blue-400 transition-all py-3 font-medium text-white rounded-xl cursor-pointer">Book Now</button>
         <p className="text-center text-sm">No Credit Card Required To Reserve.</p>
        </form>
      </div>
    </div>
  ) : (
    <Loader/>
  )
};

export default Cardetail;
