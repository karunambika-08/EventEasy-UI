//Packages and hooks
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Layout and  Pages
import MainLayout from './Layout/MainLayout';
import UserRegistration from './pages/UserRegistration';
import OwnerDashboard from './pages/OwnerDashboard'
import Appointments from './pages/Appointments';
import Events from './pages/Events';
import Bookings from './pages/Bookings';


function App() {
  const [currentUserId, setCurrentUserId] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  // To fetch the user id and details from the local storage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setCurrentUserId(currentUser);
    }

    const userInfo = localStorage.getItem('userDetails');
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserDetails(parsedUserInfo);
      } catch (error) {
        console.error('Error parsing user details:', error);
      }
    }
  }, []); // Empty dependency array means this effect runs once on mount

  return (

    <div className="App">
      {/* Main routing paths */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserRegistration />} />
          <Route path="/owner/*" element={<OwnerRoutes/>}></Route>
          <Route path="/user/*" element={<UserRoutes />} />
         
        </Routes>
      </BrowserRouter>
    </div>
  );

  // To handle the owner routes
  function OwnerRoutes() {
    return (
      <MainLayout type="owner" username={userDetails?.username}>
        <Routes>
          <Route path="dashboard/*" element={<AppointmentRoute></AppointmentRoute>} />
        </Routes>
      </MainLayout>
    );
  }

  //Function to handle the user routes
  function UserRoutes() {
    return (
      <MainLayout type="user" username={userDetails?.username}>
        <Routes>
          <Route path="/" element={<Appointments userId={userDetails?.userId} />} />
          <Route path="appointments" element={<Appointments userId={userDetails?.userId} />} />
          <Route path="events/*" element={<EventsRoutes />} />
        </Routes>
      </MainLayout>
    );
  }

  // Function to the handle the routes of attendee from events
  function EventsRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="booking" element={<Bookings userId={userDetails?.userId} userType={userDetails?.type}/>} />
      </Routes>
    );
  }

   // Function to the handle the routes of events from dashboard and appointments
  function AppointmentRoute() {
    return (
      <Routes>
        <Route path="/" element={<OwnerDashboard userId={userDetails?.userId} userType={userDetails?.userType} />} />
        <Route path="event/appointments" element={<Bookings userType={userDetails?.type} />} />
      </Routes>
    );
  }
}

export default App;
