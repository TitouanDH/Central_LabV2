import React, { useState, useEffect } from 'react';
import { Header } from "../components";
import Axios from "../Axios";
import { useAuthHeader, useIsAuthenticated } from 'react-auth-kit';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateReservation() {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(0);
  const [purpose, setPurpose] = useState('');
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    Axios.get(`get_reservation/${id}/`, {
      headers: {
        'Authorization': authHeader()
      }
    })
    .then(response => {
      const reservation = response.data;
      setName(reservation.name);
      setPurpose(reservation.purpose);

      // Calculate duration in hours
      const endTime = new Date(reservation.end);
      const currentTime = new Date();
      const durationInMilliseconds = endTime - currentTime;
      const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

      // Round to two decimal places if needed
      setDuration(Math.round(durationInHours * 100) / 100);

    })
    .catch(error => {
      console.error('Error fetching reservation:', error);
    });
  }, [id, authHeader]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      console.log("User is not authenticated. Redirecting to login.");
      navigate('/login');
      return;
    }

    const formData = {
      name,
      duration,
      purpose
    };

    try {
      const response = await Axios.post(`update_reservation/${id}/`, formData, {
        headers: {
          'Authorization': authHeader()
        }
      });

      if (response.status === 200) {
        console.log("Reservation updated:", response.data);
        navigate('/reservation');
      }

    } catch (e) {
      console.log(e);
    }
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
      <div className="mx-auto max-w-2xl py-10 sm:py-14 lg:py-18 z-10 relative">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mt-10">
            Update Reservation
          </h1>
          <p className="mt-12 text-lg leading-8 text-gray-600">
            Edit the fields to update your reservation.
          </p>
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-md shadow-sm">
              <label className="block text-sm font-medium text-gray-600 text-left" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-sm text-gray-900 placeholder-gray-400 bg-white border rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter reservation name"
                required
              />
            </div>
            <div className="rounded-md shadow-sm">
              <label className="block text-sm font-medium text-gray-600 text-left" htmlFor="duration">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-sm text-gray-900 placeholder-gray-400 bg-white border rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter duration"
                required
              />
            </div>
            <div className="rounded-md shadow-sm">
              <label className="block text-sm font-medium text-gray-600 text-left" htmlFor="purpose">
                Purpose
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-sm text-gray-900 placeholder-gray-400 bg-white border rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter purpose"
                rows="4"
              ></textarea>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
