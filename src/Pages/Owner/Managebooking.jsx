import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../../Context/Appcontext";
import Title from "../../Components/Owner/Title";


const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const {token} = useAppContext();

  const fetchOwnerBookings = async () => {
    try {
      const {data} = await axios.get('/api/booking/owner',{
        headers:{Authorization:`Bearer ${token}`}
      })
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const {data} = await axios.post('/api/booking/change-status',{bookingId,status})
      if(data.success) {
        toast.success(data.message)
        fetchOwnerBookings();
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if(token)
      fetchOwnerBookings();
  }, [token]);

  return (
    <div className="w-full px-4 pt-10 md:px-10">
      {/* Page Title */}
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Car</th>
                <th className="px-4 py-3 hidden md:table-cell">Date Range</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 hidden md:table-cell">Payment</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Car */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-md object-cover"
                      src={booking.car.image}
                      alt={`${booking.car.brand} ${booking.car.model}`}
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.car.category} · {booking.car.transmission}
                      </p>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {booking.pickupDate.split("T")[0]} —{" "}
                    {booking.returnDate.split("T")[0]}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-medium">
                    ₹{booking.price.toLocaleString()}
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {booking.paymentMethod || "Offline"}
                    </span>
                  </td>

                  {/* Status / Actions */}
                  <td className="px-4 py-3 text-center">
                    {booking.status.toLowerCase() === "pending" ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        className="px-2 py-1.5 text-gray-600 border border-gray-300 rounded-md outline-none bg-white"
                        value={booking.status.toLowerCase()}
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status.toLowerCase() === "confirmed"
                            ? "bg-green-100 text-green-600"
                            : booking.status.toLowerCase() === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBooking;
