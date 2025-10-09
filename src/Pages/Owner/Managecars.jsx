import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets';
import Title from '../../Components/Owner/Title';
import { useAppContext } from '../../Context/Appcontext';
import axios from 'axios';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, ModalBody, ModalHeader } from 'flowbite-react';

const Managecars = () => {
  const [cars,setCars] = useState([]);
  const {isOwner} = useAppContext();
  const [loading,setLoding] = useState(false);
  const [openModal,setOpenModal] = useState(false);
  const [selectedCar,setSelectedCar] = useState(null);
  const [updatedCar,setUpdatedCar] = useState({
    brand:"",
    model:"",
    year:0,
    pricePerDay:0,
    category:"",
    transmission:"",
    fuel_type:"",
    seating_capacity:0,
    location:"",
    description:""
  })
  const [updatedImage,setUpdatedImage] = useState(null);

  const fetchOwnerCars = async() => {
    try {
      const {data} = await axios.get('/api/owner/owner-cars');
      if(data.success) {
        setCars(data.cars)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability = async (carId) =>{
    try {
      const {data} = await axios.post('/api/owner/toggle-availability',{carId})
      if(data.success) {
        toast.success(data.message)
        fetchOwnerCars();
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm("Are You Sure You Delete the car.")
      if(!confirm) return null;
      const { data } = await axios.delete('/api/owner/delete-car', {
       data: { carId }  
       });
      if(data.success) {
        toast.success('Car Deleted Successfully')
        fetchOwnerCars();
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openUpdateModal = (car) => {
    setSelectedCar(car);
    setUpdatedCar({...car});
    setUpdatedImage(null);
    setOpenModal(true);
  }

  const handleUpdateCar = async(e) => {
    e.preventDefault();
    if(!selectedCar) return;
    setLoding(true);
    try {
      const formData = new FormData();
      formData.append("carId",selectedCar._id);
      formData.append("carData",JSON.stringify(updatedCar));
      if(updatedImage) formData.append('image',updatedImage);

      const {data} = await axios.put('/api/owner/update-car',formData);
      if(data.success) {
        toast.success("Car Update Successfully");
        setOpenModal(false);
        fetchOwnerCars();
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoding(false);
    }
  }

  useEffect(() =>{
   isOwner && fetchOwnerCars();
  },[isOwner])
  return (
    <>
    <div className='px-4 pt-10 md:px-10 w-full'>
    <Title title="Manage Cars" subTitle="View all listed cars, update their 
    details, or remove them from the booking platform" />
    <div className='max-w-3xl w-full rounded-md overflow-hidden border border-black mt-6'>
    <table className='w-full border-collapse text-left text-sm text-gray-600'>
     <thead className='text-gray-500'>
      <tr>
        <th className='p-3 font-medium'>Car</th>
        <th className='p-3 font-medium max-md:hidden'>Category</th>
        <th className='p-3 font-medium'>Price</th>
        <th className='p-3 font-medium max-md:hidden'>Status</th>
        <th className='p-3 font-medium'>Actions</th>
      </tr>
     </thead>
     <tbody>
      {cars.map((car,index)=>(
        <tr className='border-t border-black' key={index}>
         <td className='p-3 flex items-center gap-3'>
          <img className='w-12 h-12 aspect-square rounded-md object-cover' src={car.image} alt="" />
          <div className='max-md:hidden'>
           <p className='font-medium'>{car.brand} {car.model}</p>
           <p className='text-xs text-gray-500'>{car.seating_capacity} {car.transmission}</p>
          </div>
         </td>
         <td className='p-3 max-md:hidden'>{car.category}</td>
         <td className='p-3'>${car.pricePerDay}/day</td>
         <td className='p-3 max-md:hidden'>
         <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>
          {car.isAvailable? "Available":"Unavailable"}
         </span>
         </td>
         <td className='flex items-center gap-2'>
          <img onClick={()=>toggleAvailability(car._id)} src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} className='cursor-pointer' alt="" />
          <img onClick={()=>deleteCar(car._id)} className='cursor-pointer' src={assets.delete_icon} alt="" />
          <div onClick={()=>openUpdateModal(car)} className='cursor-pointer'>
            <Pencil size={18} />
          </div>
         </td>
        </tr>
      ))}
     </tbody>
    </table>
    </div>
    </div>
    <Modal show={openModal} size='3xl'onClose={()=>setOpenModal(false)}>
     <ModalHeader>Update Car</ModalHeader>
     <ModalBody>
      <form onSubmit={handleUpdateCar} className="flex flex-col gap-4">
       <div className='flex items-center gap-3'>
         <label htmlFor="update-image">
          <img className='w-24 h-24 rounded-md object-cover cursor-pointer' src={updatedImage?URL.createObjectURL(updatedImage) : selectedCar?.image || assets.upload_icon} alt="" />
          <input onChange={(e)=>setUpdatedImage(e.target.files[0])} type="file" id='update-image' accept='image/*' hidden />
         </label>
         <p className='text-gray-500 text-sm'>Upload New Car Image</p>
       </div>
       <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label>Brand</label>
          <input className='px-3 py-2 mt-1 border rounded-md w-full' type="text" value={updatedCar.brand} onChange={(e)=>setUpdatedCar({...updatedCar,brand:e.target.value})} required />
        </div>
        <div>
          <label>Model</label>
          <input className="px-3 py-2 mt-1 border rounded-md w-full" type="text" value={updatedCar.model} onChange={(e)=>setUpdatedCar({...updatedCar,model:e.target.value})} required/>
        </div>
       </div>
       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
         <input className="px-3 py-2 mt-1 border rounded-md w-full" type="number" value={updatedCar.year} onChange={(e)=>setUpdatedCar({...updatedCar,year:e.target.value})} required />
       </div>
       <div>
        <label>Daily Price</label>
        <input className="px-3 py-2 mt-1 border rounded-md w-full" type="number" value={updatedCar.pricePerDay} onChange={(e)=>setUpdatedCar({...updatedCar,pricePerDay:e.target.value})} required />
       </div>
       <div>
        <label>Category</label>
        <select className="px-3 py-2 mt-1 border rounded-md w-full" value={updatedCar.category} onChange={(e)=>setUpdatedCar({...updatedCar,category:e.target.value})} required>
          <option value="">Select</option>
                <option value="Sedan">Sedan</option>
                <option value="Suv">Suv</option>
                  <option value="Van">Van</option>
        </select>
       </div>
       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
         <div>
          <label>Transmission</label>
         <select className="px-3 py-2 mt-1 border rounded-md w-full" value={updatedCar.transmission} onChange={(e)=>setUpdatedCar({...updatedCar,transmission:e.target.value})} required>
           <option value="">Select</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
         </select>
         </div>
         <div>
          <label>Fuel Type</label>
          <select className="px-3 py-2 mt-1 border rounded-md w-full" value={updatedCar.fuel_type} onChange={(e)=>setUpdatedCar({...updatedCar,fuel_type:e.target.value})} required>
            <option value="">Select</option>
                  <option value="Gas">Gas</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
          </select>
         </div>
         <div>
          <label>Seating Capacity</label>
          <input className="px-3 py-2 mt-1 border rounded-md w-full" type="number" value={updatedCar.seating_capacity}  onChange={(e) => setUpdatedCar({ ...updatedCar, seating_capacity: e.target.value })} />
         </div>
       </div>
       <div>
        <label>Location</label>
        <input className="px-3 py-2 mt-1 border rounded-md w-full" type="text" value={updatedCar.location} onChange={(e) => setUpdatedCar({ ...updatedCar, location: e.target.value })} required/>
       </div>
       <div>
        <label>Description</label>
        <textarea   className="px-3 py-2 mt-1 border rounded-md w-full" value={updatedCar.description}  onChange={(e) => setUpdatedCar({ ...updatedCar, description: e.target.value })} rows={4} required>
        </textarea>
       </div>
       <div className='flex gap-4 justify-end mt-4'>
        <button className="px-4 py-2 cursor-pointer rounded-md bg-gray-300 text-gray-700" type='button' onClick={()=>setOpenModal(false)}>Cancel</button>
        <button  className="px-4 py-2 rounded-md bg-blue-600 cursor-pointer text-white" type='submit' disabled={loading}> {loading ? 'Updating...' : 'Update'}</button>
       </div>
      </form>
     </ModalBody>
    </Modal>
    </>
  )
}

export default Managecars