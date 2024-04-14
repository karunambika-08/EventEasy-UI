import { useState ,useEffect } from "react";
import styles from "../../styles/OwnerDashboard.module.css"

import {FaPlus } from 'react-icons/fa'
import  EventForm from '../../components/owner/EventForm'
import CreatedEvents from "../../components/owner/CreatedEvents";



function OwnerDashboard(props) {
  const {newEvent , onClose ,userId , userType} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [currentUserId, setCurrentUserId] = useState(null);
  let [userDetails, setUserDetails] = useState({});
  // const [events, setEvents] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };


 

  return (
    <div className={styles.ownerDashboard}>
      {/* <div className={styles.navbarContainer}> */}
           
      {/* </div> */}

      <div className= {styles.mainContainer}>
        <div className={styles.eventsMainContainer}>
        <div className={styles.headerContainer}>
              <h2>Dashboard</h2>
              {/* <!-- <div class="eventsSearch"><input type="search" name="eventsSearch" id="eventsSearch" placeholder="Search"></div> --> */}
              <button className={styles.createAppointmentBtn} onClick={toggleModal}> <FaPlus></FaPlus> Create Event</button>
          </div>
           {isModalOpen && (
            <div className={styles.overlayContainer} style={{display : isModalOpen? "flex" : "none"}} onClick={handleCloseModal}>
              <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
                <EventForm  
                userId={userId} 
                onClose={handleCloseModal} 
                // initialEvent={{}}
                />
              </div>
            </div>
          )}
            <CreatedEvents 
            userId={userId}
            userType={userType}
            // events = {events}
            // setEvents={setEvents} 
            ></CreatedEvents>
        </div>
      </div>
    </div>
  
  )
}

export default OwnerDashboard