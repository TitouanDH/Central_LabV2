import React, { useEffect, useState } from 'react';
import Axios from "../Axios";
import { useAuthHeader } from 'react-auth-kit';

export default function Testing() {
  const [reservations, setReservations] = useState([]);
  const authHeader = useAuthHeader();

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

  return (
    <div className="mt-32 mx-auto w-2/5">
      <ul role="list" className="divide-y divide-gray-100">
        {reservations.map((reservation, index) => (
          <li key={index} className="flex justify-between gap-x-4 py-4">
            <div className="flex min-w-0 gap-x-2">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-6 text-gray-900">{reservation.name}</p>
                  <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatus(reservation.end) === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {getStatus(reservation.end)}
                  </div>
                </div>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">Expires {reservation.end}</p>
              </div>
            </div>
            <div className="hidden sm:flex sm:flex-row sm:items-center">
              <button className="text-sm font-medium border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                View Reservation
              </button>
              <button className="ml-2 flex flex-col items-center hover:bg-gray-300 p-1 rounded">
                <div className="bg-gray-400 h-0.75 w-0.75 rounded-full mb-1"></div>
                <div className="bg-gray-400 h-0.75 w-0.75 rounded-full mb-1"></div>
                <div className="bg-gray-400 h-0.75 w-0.75 rounded-full"></div>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
