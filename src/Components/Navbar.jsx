import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets, menuLinks } from '../assets/assets'
import { useAppContext } from '../Context/Appcontext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";


const Navbar = () => {
    const location = useLocation();
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    const [showModal,setShowModal] = useState(false);
    const {setShowLogin,user,logout,isOwner,setIsOwner} = useAppContext()

    const changeRole = async() => {
      try {
        const {data} = await axios.post('/api/owner/change-role')
        if(data.success) {
          setIsOwner(true);
          toast.success(data.message)
          setShowModal(false);
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const handleListCarsClick = () => {
      if(isOwner) {
        navigate("/owner")
      } else{
        setShowModal(true)
      }
    }
  return (
    <>
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border border-black relative transition-all ${location.pathname === "/" && "bg-light"}`}>
     <Link to="/">
      <img className='h-8' src={assets.logo} alt="" />
     </Link>
     <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t  right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>
        {menuLinks.map((link,index)=>(
            <Link key={index} to={link.path}>
               {link.name}
            </Link>
        ))}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-black px-3 rounded-full max-w-56'>
          <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search Cars' />
          <img src={assets.search_icon} alt="" srcset="" />
          
        </div>
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          <button onClick={handleListCarsClick} className='cursor-pointer'>{isOwner?"Dashboard":"List Cars"}</button>
          <button onClick={()=>{user?logout() : setShowLogin(true)}} className='cursor-pointer px-8 py-2 bg-blue-600 hover:bg-blue-400 transition-all text-white rounded-lg'>{user ? 'Logout' :'Login'}</button>
        </div>
     </div>
     <button onClick={()=>setOpen(!open)} className='sm:hidden cursor-pointer bg-white'>
      <img src={open ? assets.close_icon : assets.menu_icon} alt="" />
     </button>
    </div>
    <Modal show={showModal} onClose={()=>setShowModal(false)} size='md' popup >
     <ModalHeader>
      <ModalBody>
        <div className='text-center'>
         <h3 className='mb-4 text-lg font-semibold text-gray-800'>Owner Feature Access</h3>
         <p className='text-gray-600 mb-6'>
          This feature is only for <b>car business owners</b>.  
           If you are a customer, please don’t continue.  
          If you’re an owner, click “I’m an Owner” to proceed.
         </p>
         <div className='flex justify-center gap-4'>
          <Button color="gray" className='cursor-pointer' onClick={()=>setShowModal(false)}>Cancel</Button>
          <Button color="blue" className='cursor-pointer' onClick={changeRole}>I'm an Owner</Button>
         </div>
        </div>
      </ModalBody>
     </ModalHeader>
    </Modal>
    </>
  )
}

export default Navbar