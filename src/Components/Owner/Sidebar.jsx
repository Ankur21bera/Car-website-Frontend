import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../Context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";


const Sidebar = () => {
  const { user, fetchUser } = useAppContext();
  const [image, setImage] = useState("");
  const [showModal, setShowModal] = useState(false); 
  const [updating, setUpdating] = useState(false);

  const updateImage = async () => {
    if (!image) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/update-image", formData);
      if (data.success) {
        fetchUser();
        toast.success("Image Updated Successfully");
        setImage("");
        setShowModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-black text-sm">
      {/* Profile Image Section */}
      <div className="relative mt-4">
        <label htmlFor="image" className="group relative cursor-pointer">
          <img
            className="h-14 w-14 rounded-full mx-auto object-cover"
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image || assets.profile_icon
            }
            alt="Profile"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center">
            <img src={assets.edit_icon} alt="Edit" />
          </div>
        </label>

        {/* Save Button triggers Modal */}
        {image && (
          <button
            onClick={() => setShowModal(true)}
            className="absolute top-0 right-0 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 transition-all"
          >
            Save <img src={assets.check_icon} width={13} alt="save" />
          </button>
        )}
      </div>

      {/* Flowbite Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>Confirm Update</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to update your profile picture?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={updateImage} disabled={updating}>
            {updating ? "Updating..." : "Yes, Update"}
          </Button>
        </ModalFooter>
      </Modal>

      <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

      {/* Sidebar Links */}
      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-2 w-full py-3 pl-4 transition-all ${
                isActive
                  ? "bg-blue-500 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <img src={link.icon} alt="" className="h-5 w-5" />
            <span className="max-md:hidden">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
