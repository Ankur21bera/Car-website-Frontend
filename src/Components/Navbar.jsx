import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets, menuLinks } from "../assets/assets";
import { useAppContext } from "../Context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { setShowLogin, user, logout, isOwner, setIsOwner } =
    useAppContext();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        setShowModal(false);
        navigate("/owner");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleListCarsClick = () => {
    if (isOwner) {
      navigate("/owner");
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="relative z-50 border-b">
        <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-700 bg-white">
          {/* Logo */}
          <Link to="/" onClick={() => setOpen(false)}>
            <img src={assets.logo} alt="logo" className="h-8" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex items-center gap-8">
            {menuLinks.map((link, index) => (
              <Link key={index} to={link.path} className="hover:text-black">
                {link.name}
              </Link>
            ))}

            <div className="hidden lg:flex items-center text-sm gap-2 border border-black px-3 rounded-full w-56">
              <input
                type="text"
                className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                placeholder="Search Cars"
              />
              <img src={assets.search_icon} alt="" />
            </div>

            <button
              onClick={handleListCarsClick}
              className="cursor-pointer"
            >
              {isOwner ? "Dashboard" : "List Cars"}
            </button>

            <button
              onClick={() => (user ? logout() : setShowLogin(true))}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden cursor-pointer"
          >
            <img src={assets.menu_icon} alt="menu" />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 sm:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <img src={assets.logo} alt="" className="h-7" />
          <button onClick={() => setOpen(false)}>
            <img src={assets.close_icon} alt="close" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {menuLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className="py-2 border-b"
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={() => {
              setOpen(false);
              handleListCarsClick();
            }}
            className="text-left py-2 border-b"
          >
            {isOwner ? "Dashboard" : "List Cars"}
          </button>

          <button
            onClick={() => {
              setOpen(false);
              user ? logout() : setShowLogin(true);
            }}
            className="mt-4 bg-blue-600 text-white py-2 rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </aside>

      {/* OWNER MODAL */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Owner Feature Access
            </h3>
            <p className="text-gray-600 mb-6">
              This feature is only for <b>car business owners</b>.  
              If you’re an owner, click below to continue.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button color="blue" onClick={changeRole}>
                I'm an Owner
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Navbar;
