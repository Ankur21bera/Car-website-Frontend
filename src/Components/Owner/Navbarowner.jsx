import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../Context/Appcontext';
const Navbarowner = () => {
    const {user} = useAppContext();
  return (
    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-black relative transition-all'>
     <Link to="/">
     <img className='h-7' src={assets.logo} alt="" />
     </Link>
     <p>Welcome,{user?.name || "Owner"}</p>
    </div>
  )
}

export default Navbarowner