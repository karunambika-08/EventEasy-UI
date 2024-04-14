
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import './App.css'

import UserAuthentication from './pages/UserAuthentication'
import OwnerDashboard from './pages/Owner/OwnerDashboard'
import AttendeePages from './pages/AttendeePages'
import Profile from './components/Profile'
import SideBar from './components/SideBar'
import Appointments from './components/attendee/Appointments'
import Events from './components/attendee/Events'
import Booking from './components/attendee/Booking'
import Header from './components/Header'
import BookedAppointments from './components/owner/BookedAppointments'


function App() {
  // let navigate = useNavigate()
  let [currentUserId, setCurrentUserId] = useState(null);
  let [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || undefined;
    console.log("current", currentUserId);
    if (!currentUser) {
      // navigate('/')
    } else {
      setCurrentUserId(currentUser);
     let userInfo = JSON.parse(localStorage.getItem('userDetails'));
      if (userInfo) {
        console.log("userDetails", userInfo);
        setUserDetails(userInfo);
      }
    }
  }, []);

 
  function OwnerRoutes() {

    return (

      <SideBar type="owner" username={userDetails.username}>
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard/*" element={<AppointmentRoute />} />

        </Routes>
      </SideBar>
    );
  }
  
  function UserRoutes() {
    return (
      <SideBar type="user" username={userDetails.username}>
        <Routes>
          <Route path="dashboard" element={<AttendeePages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="appointments" element={<Appointments userId={userDetails.userId} />} />
          <Route path="events/*" element={<EventsRoutes />} />
          
        </Routes>
      </SideBar>
    );
  }
  
  function EventsRoutes() {
    return (
      <Routes >
        <Route path="/" element={<Events />} />
        <Route path="booking/:id" element={<Booking userId={userDetails.userId} />} />
      </Routes>
    );

  }

  function AppointmentRoute(){
    return (
      <Routes >
       <Route path="/" element={<OwnerDashboard  userId= {userDetails.userId} userType={userDetails.userType}/>} />
        <Route path="event/appointments/:id" element={<BookedAppointments />} />
      </Routes>
    );
  }

  return (
    <div className="App">
  
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserAuthentication/>} />

          <Route path="/owner/*" element={<OwnerRoutes />} />

          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </BrowserRouter>
      </div>
  )

  

}


// <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={<UserAuthentication />}
//           />

//           <Route
//             path="/owner/*"
//             element={
//               <SideBar type='owner'>
//                 <Routes>
//                   <Route path="dashboard" element={<OwnerDashboard />} />
                  
//                   <Route path="profile" element={<Profile />} />
//                 </Routes>
//               </SideBar>
//             }
//           />

//           <Route

//             path="/user/*"
//             element={
//               <SideBar type='user'>
//                 <Routes>
//                   <Route path="dashboard" element={<AttendeePages />} />
//                   <Route path="profile" element={<Profile />} />
//                   <Route path='appointments' element={<Appointments userId={userDetails.userId}></Appointments>}> </Route>
//                   <Route path="events/*" element={<Events />}>
//                       <Route path="booking" element={<Booking />} />
//                   </Route>
//                 </Routes>
//                 </SideBar>
//             }
//           />
//         </Routes>
//       </BrowserRouter>

//     </div>


export default App
