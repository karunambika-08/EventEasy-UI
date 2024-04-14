import { useEffect, useState } from "react";
import { formatDate, setSessionDuration } from "../../utils/dateFormatter.js"
import { useParams } from "react-router-dom";
import Header from "../Header";
import Calender from "../Calender.jsx";
function Booking(props) {
  const { userId} = props
  const { id } = useParams()
  const [eventInfo, setEventInfo] = useState({});

  const [tab , setTab] = useState('EventDetails');

  function showEventDetails(){
    setTab('EventDetails')
  }

  function showBookingDetails(){
    setTab('BookingDetails')
  }

  useEffect(() => {
    const storedEvent = localStorage.getItem('selectedEvent');
    if (storedEvent) {
      setEventInfo(JSON.parse(storedEvent));
    }
  }, []);
  // console.log('selected', eventInfo.eventId)
  return (
      <div className="bookingContainer">
        {/* Render booking details using eventInfo */}
        {(eventInfo )  && (
          <div className={
            tab === 'EventDetails' ? 'showEventsTab' : 'hideEventsTab'
          }>
          <div className="eventdetailsContainer">
            {/* Display event details */}
            <div className="edetailsContainer">
               {/* Display other event details */}
               <h2>{eventInfo.eventName}</h2>
              <p>Start Date: {formatDate(eventInfo.startDate)}</p>
              <p>End Date: {formatDate(eventInfo.endDate)}</p>
              <p>Duration : {setSessionDuration(eventInfo.appointmentDuration)}</p>
              <p>Mode : {"Online"}</p>
              {/* Display event image */}
              {/* <img src={eventInfo.imageUrl} alt={eventInfo.eventName} /> */}
              {/* <button onClick={showBookingDetails} >Book An Appointment</button> */}
            </div>
          </div>
          </div>
        )}
         
           <div className="appointmentsBookingContainer">
           {/* Add other booking-related components */}
           <div className="appointmentsCalender">
            <h3>{}</h3>
             <Calender id={id} eventInfo= {eventInfo} userId={userId} action="viewSlots"></Calender>
           </div>
           {/* <button onClick={showEventDetails}>Previous</button> */}
          
         </div>
        
       
      </div>
 
  );

}

export default Booking;
