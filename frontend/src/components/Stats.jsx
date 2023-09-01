import React, { useEffect, useState } from 'react';
import Axios from "../Axios";

export default function Stats() {
  const [userCount, setUserCount] = useState("Loading...");
  const [dutCount, setDutCount] = useState("Loading...")
  const [reservationCount, setReservationCount] = useState("Loading...")

  useEffect(() => {
    Axios.get('view/stats/')
      .then(response => {
        setUserCount(response.data.users)
        setDutCount(response.data.duts)
        setReservationCount(response.data.reservations)
      })
      .catch(error => {
        console.error('There was an error fetching stats:', error);
      });
  }, []);

  const stats = [
    { id: 1, name: 'Reservations', value: reservationCount},
    { id: 2, name: 'DUTs', value: dutCount},
    { id: 3, name: 'Users', value: userCount},
  ];

  return (
    <div className="bg-purple-500  py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-200">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-100 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
