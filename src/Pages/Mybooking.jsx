

// import React, { useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import Title from "../Components/Title";
// import { useAppContext } from "../Context/Appcontext";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

// const MyBooking = () => {
//   const [bookings, setBookings] = useState([]);
//   const { user, token } = useAppContext();

//   // ✅ Fetch all user's bookings
//   const fetchMyBookings = async () => {
//     try {
//       const { data } = await axios.get("/api/booking/user", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (data.success) {
//         setBookings(data.bookings);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };


  

//   useEffect(() => {
//     if (user && token) fetchMyBookings();
//   }, [user, token]);

//   return (
//     <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
//       <Title
//         title="My Bookings"
//         subTitle="View and manage your car bookings"
//         align="left"
//       />

//       {/* ✅ Booking List */}
//       {bookings.length === 0 ? (
//         <p className="text-center text-gray-500 mt-10">No bookings found.</p>
//       ) : (
//         bookings.map((booking, index) => (
//           <div
//             key={booking._id}
//             className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-lg mt-5 bg-white shadow-sm hover:shadow-md transition"
//           >
//             {/* Car Info */}
//             <div className="md:col-span-1">
//               <img
//                 className="rounded-md w-full h-auto aspect-video object-cover"
//                 src={booking.car.image}
//                 alt={booking.car.model}
//               />
//               <p className="text-lg font-semibold mt-2">
//                 {booking.car.brand} {booking.car.model}
//               </p>
//               <p className="text-gray-500">
//                 {booking.car.year} • {booking.car.category}
//               </p>
//             </div>

//             {/* Booking Info */}
//             <div className="md:col-span-2">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="px-3 py-1 bg-gray-100 rounded text-sm">
//                   #{index + 1}
//                 </span>
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full ${
//                     booking.status === "confirmed"
//                       ? "bg-green-100 text-green-700"
//                       : booking.status === "cancelled"
//                       ? "bg-red-100 text-red-600"
//                       : "bg-yellow-100 text-yellow-600"
//                   }`}
//                 >
//                   {booking.status}
//                 </span>
//               </div>
//               <div className="flex items-start gap-2">
//                 <img
//                   src={assets.calendar_icon_colored}
//                   alt=""
//                   className="w-4 h-4 mt-1"
//                 />
//                 <div>
//                   <p className="text-gray-500">Rental Period</p>
//                   <p>
//                     {booking.pickupDate.split("T")[0]} -{" "}
//                     {booking.returnDate.split("T")[0]}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-2 mt-3">
//                 <img
//                   src={assets.location_icon_colored}
//                   alt=""
//                   className="w-4 h-4 mt-1"
//                 />
//                 <div>
//                   <p className="text-gray-500">Pickup Location</p>
//                   <p>{booking.car.location}</p>
//                 </div>
//               </div>

//             </div>
//             <div className="text-right md:col-span-1">
//               <p className="text-gray-500 text-sm">Total Price</p>
//               <h2 className="text-2xl font-semibold text-blue-500">
//                 ₹{booking.price}
//               </h2>
//               <p className="text-gray-400 text-xs">
//                 Booked on {booking.createdAt.split("T")[0]}
//               </p>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyBooking;

import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import { useAppContext } from "../Context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const { user, token } = useAppContext();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showBillModal, setShowBillModal] = useState(false);

  // ✅ Fetch all user's bookings
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/booking/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user && token) fetchMyBookings();
  }, [user, token]);

  // ✅ Handle Offline Payment (Cash)
  const handleOfflinePayment = async (bookingId) => {
    try {
      const { data } = await axios.post(
        "/api/payment/offline",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Offline payment request sent!");
        fetchMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Handle Online Payment (Razorpay)
  const handleOnlinePayment = async (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  // ✅ Razorpay Payment Confirmation
  const confirmOnlinePayment = async () => {
  try {
    const { data } = await axios.post(
      "/api/payment/razorpay-order",
      { bookingId: selectedBooking._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!data.success) {
      toast.error("Failed to create Razorpay order");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "Car Rental Payment",
      description: "Booking Payment",
      order_id: data.order.id,
      handler: async function (response) {
        try {
          // -----------------------------
          // Verify payment in backend
          // -----------------------------
          const verifyRes = await axios.post(
            "/api/payment/razorpay-verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: selectedBooking._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful!");
            fetchMyBookings();
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (err) {
          toast.error(err.message);
        } finally {
          // -----------------------------
          // Fix scroll issue
          // -----------------------------
          document.body.style.overflow = "auto";
        }
      },
      theme: { color: "#1E3A8A" },
      modal: {
        ondismiss: () => {
          document.body.style.overflow = "auto"; // restore scroll if user closes modal
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setShowPaymentModal(false);
  } catch (error) {
    toast.error(error.message);
    document.body.style.overflow = "auto"; // restore scroll on error
  }
};

const handleViewBill = (booking) => {
    setSelectedBooking(booking);
    setShowBillModal(true);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
      <Title
        title="My Bookings"
        subTitle="View and manage your car bookings"
        align="left"
      />

      {/* ✅ Booking List */}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-gray-200 rounded-lg mt-5 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Car Info */}
            <div className="md:col-span-1">
              <img
                className="rounded-md w-full h-auto aspect-video object-cover"
                src={booking.car.image}
                alt={booking.car.model}
              />
              <p className="text-lg font-semibold mt-2">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                {booking.car.year} • {booking.car.category}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                  #{index + 1}
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <img
                  src={assets.calendar_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split("T")[0]} -{" "}
                    {booking.returnDate.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.location_icon_colored}
                  alt=""
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="text-gray-500">Pickup Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>

              {/* ✅ Payment Buttons */}
              {booking.status === "pending" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleOfflinePayment(booking._id)}
                    className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Pay Offline
                  </button>
                  <button
                    onClick={() => handleOnlinePayment(booking)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    Pay Online
                  </button>
                </div>
              )}
              {booking.status === "confirmed" && (
                <button
                  onClick={() => handleViewBill(booking)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm mt-5 transition cursor-pointer"
                >
                  View Bill
                </button>
              )}
            </div>

            {/* Price Info */}
            <div className="text-right md:col-span-1">
              <p className="text-gray-500 text-sm">Total Price</p>
              <h2 className="text-2xl font-semibold text-blue-500">
                ₹{booking.price}
              </h2>
              <p className="text-gray-400 text-xs">
                Booked on {booking.createdAt.split("T")[0]}
              </p>
            </div>
          </div>
        ))
      )}

      {/* ✅ Payment Modal */}
      <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
        <ModalHeader>Confirm Online Payment</ModalHeader>
        <ModalBody>
          <p>
            You’re about to pay <b>₹{selectedBooking?.price}</b> for{" "}
            <b>
              {selectedBooking?.car.brand} {selectedBooking?.car.model}
            </b>
            .
          </p>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={confirmOnlinePayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Confirm & Pay
          </button>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
      <Modal show={showBillModal} onClose={() => setShowBillModal(false)}>
        <ModalHeader>Bill Details</ModalHeader>
        <ModalBody>
          {selectedBooking && (
            <div className="space-y-2">
              <p>
                <b>Car:</b> {selectedBooking.car.brand}{" "}
                {selectedBooking.car.model} ({selectedBooking.car.year})
              </p>
              <p>
                <b>Rental Period:</b>{" "}
                {selectedBooking.pickupDate.split("T")[0]} -{" "}
                {selectedBooking.returnDate.split("T")[0]}
              </p>
              <p>
                <b>Pickup Location:</b> {selectedBooking.car.location}
              </p>
              <p>
                <b>Total Amount:</b> ₹{selectedBooking.price}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setShowBillModal(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default MyBooking;
