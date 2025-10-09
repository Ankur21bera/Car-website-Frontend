import React, { useEffect } from 'react'
import Navbarowner from '../../Components/Owner/Navbarowner'
import Sidebar from '../../Components/Owner/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../Context/Appcontext'

const Layout = () => {
  const navigate = useNavigate();
  const {isOwner} = useAppContext();

  useEffect(() => {
    if(!isOwner) {
      navigate('/')
    }
  },[isOwner])
  return (
    <div className='flex flex-col'>
        <Navbarowner/>
        <div className='flex'>
         <Sidebar/>
         <Outlet/>
        </div>
    </div>
  )
}

export default Layout