import React, { useState, useEffect } from 'react';
import { Header } from "../components";
import Axios from "../Axios";
import { useAuthHeader } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options).replace('at', ' @');
};

export default function Reservation() {
  const [reservations, setReservations] = useState([]);
  const authHeader = useAuthHeader();
  const redirect = useNavigate();
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    Axios.get('list_reservation/', {
      headers: {
        'Authorization': authHeader()
      }
    })
    .then(response => {
      setReservations(response.data.reservation);
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
    });
  }, []);

  const getStatus = (end) => {
    const now = new Date();
    const endDate = new Date(end);
    const diffInHours = (endDate - now) / 1000 / 60 / 60;

    if (diffInHours < 0) {
      return 'Expired';
    }
    return 'Active';

  };

  const deleteReservation = (id) => {
    Axios.delete(`delete_reservation/${id}/`, {
      headers: {
        'Authorization': authHeader()
      }
    })
    .then(response => {
      setReservations(reservations.filter(reservation => reservation.id !== id));
      setShowDropdown(null);
    })
    .catch(error => {
      console.error('Error deleting reservation:', error);
    });
  };

  return (
    <main className="bg-purple px-6 pt-16 pb-24 lg:px-8 relative">
      <Header />
      {/* Purple tint */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      {/* End of Purple tint */}
      <div className="mx-auto max-w-6xl py-10 sm:py-14 lg:py-18 z-10 relative">
      <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mt-10">
            Manage Your Reservations
          </h1>
          <p className="mt-12 text-lg leading-8 text-gray-600">
            View and manage your existing reservations.
          </p>
        </div>
        <div className="mt-12 mx-auto w-full">
          <button 
            onClick={() => redirect('/createreservation')} 
            className="text-sm font-medium border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 mb-6"
          >
            Create New Reservation
          </button>
          <ul role="list" className="divide-y divide-gray-100">
            {reservations.map((reservation, index) => (
              <li key={index} className="flex justify-between gap-x-4 py-4 relative">
                <div className="flex min-w-0 gap-x-2">
                  <div className="min-w-0 flex-auto">
                    <div className="flex items-center">
                      <p className="text-sm font-medium leading-6 text-gray-900">{reservation.name}</p>
                      <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatus(reservation.end) === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {getStatus(reservation.end)}
                      </div>
                    </div>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">Expires {formatDate(reservation.end)}</p>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-row sm:items-center">
                <button className="text-sm font-medium border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                  View Reservation
                </button>
                <div className="relative inline-block text-left ml-2">
                  <button onClick={() => setShowDropdown(index === showDropdown ? null : index)} className="flex flex-col items-center hover:bg-gray-300 p-1 rounded">
                    <div className="bg-gray-600 h-1 w-1 rounded-full mb-1"></div>
                    <div className="bg-gray-600 h-1 w-1 rounded-full mb-1"></div>
                    <div className="bg-gray-600 h-1 w-1 rounded-full"></div>
                  </button>
                  {showDropdown === index && (
                    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button 
                        onClick={() => redirect(`/updatereservation/${reservation.id}`)}
                        className="text-gray-700 block px-4 py-2 text-sm" role="menuitem">
                          Edit
                        </button>
                        <button 
                        onClick={() => deleteReservation(reservation.id)}
                        className="text-gray-700 block px-4 py-2 text-sm" role="menuitem">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
