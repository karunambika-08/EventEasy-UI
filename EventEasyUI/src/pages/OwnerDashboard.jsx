// Packages and hooks
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
//Componets
import Loader from '../components/Loader';
import EventCard from "../components/EventCard";
import EventForm from '../components/EventForm'
//Images and utils
import noData from '../assets/noData.svg';
import noEventsSVG from '../assets/noEventsAvailable.svg';
import { formatDate , setSessionDuration} from "../utils/dateFormatter.js"
import { deleteAlert } from "../utils/Notify";
import { FaCalendarCheck, FaCalendarMinus } from 'react-icons/fa'
import { BiCalendarCheck, BiSolidHourglassBottom } from "react-icons/bi";

/**
 * Render the Event Data of the current owner respective the time
 * @param {*} props Id of the eventsowner 
 */
function OwnerDashboard(props) {
  const [userId, setUserId] = useState(() => {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser || '';
});

  // To open the event Form 
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  let [onGoingEvents, setOngoingEvents] = useState([])
  let [pastEvents, setPastEvents] = useState([])

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('onGoing');

  function openBooked() {
    setTab('onGoing');
  }

  function openCompleted() {
    setTab('completed');
  }
  useEffect(() => {
    if (userId) {
        fetchEvents();
    }
}, [userId]);

useEffect(() => {
    if (tab === 'Attended') {
        fetchPastEvents();
    }
}, [tab]);

useEffect(() => {
    setLoading(false);
}, [onGoingEvents , pastEvents]);

  /**
   * @param {*} userId 
   * @returns onGoing events data based on the userID
   */
  const fetchEvents = async (userId) => {
    try {
      fetch(`/api/eventsOwner/${userId}/events/${"ongoing"}`)
        .then(async (response) => {
          if (response.status === 200) {
            let jsonData = await response.json();
            return jsonData;
          }
        })
        .then(async (response) => {
          console.log("Response", response);
          setOngoingEvents(response)
        })
        .catch((error) => {
          console.log("Error", error)
        })
    }
    catch (e) {
      console.log("Error", e)
    }
    finally {
      setLoading(false);
    }
  }

  
   /**
   * @param {*} userId 
   * @returns Compeleted events data based on the userID
   */
   const fetchPastEvents = async () => {

    try {
      fetch(`/api/eventsOwner/${userId}/events/${"completed"}`)
        .then(async (response) => {
          if (response.status === 200) {
            let jsonData = await response.json();
            return jsonData;
          }
        })
        .then(async (response) => {
          console.log("Response", response);
          setPastEvents(response)
          console.log("Events", pastEvents);
          // await createEvent(onGoingEvents)
        })
        .catch((error) => {
          console.log("Error", error)
        })
    }
    catch (e) {
      console.log("Error", e)
    }
    finally {
      setLoading(false);
    }
  }

  // Delete the Event Card
  async function handleDelete(eventId) {
    const deleteResult = await deleteAlert()

    if (deleteResult.isConfirmed) {
      try {
        const response = await fetch(`/api/event/${eventId}/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const jsonData = await response.json();
          setOngoingEvents(prevEvents => prevEvents.filter(eventInfo => eventInfo.eventId !== eventId));
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            color: '#0064E0'
          });
          console.log(jsonData);
        } 
        else if(response.status === 412){
          Swal.fire({
            title: "Sorry,this can be deleted!",
            text: "This event has booked appointments",
            icon: "error",
            // color: '#0064E0'
          });
        }
        
        else {
          throw new Error('Failed to delete event.');
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        Swal.fire({
          title: "Sorry,this can be deleted!",
          text: "This event has booked appointments",
          icon: "error",
          // color: '#0064E0'
        });
      }
    }
  }


   // Toggle The event the form
  const toggleEventForm = () => {
    setIsEventFormOpen(!isEventFormOpen);

  };

  // Handle the Closing of the event form
  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
  };

  //Handle the newly created event and update the display
  function handleNewEvent(eventInfo){
    fetchEvents(userId)
  }

  //Handle the event edited
  function handleChanges(eventInfo) {
    console.log("Ongoing",eventInfo);
    const updatedEvents = onGoingEvents.map(event => {
      if (event.eventId === eventInfo.eventId) {
        return eventInfo;
      }
      else{
        return event;
      }
    });
    setOngoingEvents(updatedEvents);
    return updatedEvents
  }

  return (
    // Dashboard to display the ongoing events and Completed Events
    <div className={"ownerDashboard"}>
      <div className="mainEventContainer">
        <div className={"eventsMainContainer"}>
          <div className={"eventsHeaderContainer"}>
            <h2>Dashboard</h2>
            <button className={"createAppointmentBtn"} onClick={toggleEventForm}>Create Event</button>
          </div>
          {/* Render Event for Creation */}
          {isEventFormOpen &&
            <div className={"eventFormoverlayContainer"} style={{ display: isEventFormOpen ? "flex" : "none" }} onClick={handleCloseEventForm}>
              <div className={"eventFormpopup"} onClick={(e) => e.stopPropagation()}>
                <EventForm
                  userId={userId}
                  onClose={handleCloseEventForm}
                  initialEvent={null}
                  handleChanges={handleNewEvent}
                />
              </div>
            </div>
            }
          <div className={"displayCreatedEvent"}>
            <div className={"eventsStatetabs"}>
              <div className={"eventsState"}>
                <button id="OnGoingButton"
                  className={tab === 'onGoing' ? 'activeEventStateTab' : ''}
                  onClick={openBooked}> <FaCalendarCheck className='eventStatetabIcon' style={{ marginRight: "10px" }}></FaCalendarCheck>On Going</button>
                <button id="completedButton"
                  className={tab === 'completed' ? 'activeEventStateTab' : ''}
                  onClick={openCompleted}><FaCalendarMinus className='eventStatetabIcon' style={{ marginRight: "10px" }} ></FaCalendarMinus>Completed</button>
              </div>
              {// Tab to show the ongoing events
                tab === 'onGoing' && <div className={`${"onGoing"} ${tab === 'onGoing' ? "displayOngoingEventTab" : "hideOngoingEventTab"}`}>
                  {!loading ? (<div className={"eventStateContent"}>
                    <div className={"eventsContainer"} >
                      {onGoingEvents.length > 0 ? (
                        onGoingEvents.map(event =>
                          <div className={"eventCard"} key={event.eventId}>
                            {/* Renders the event card for event data */}
                            <EventCard event={event} userId={userId} handleDelete={() => handleDelete(event.eventId)} handleChanges={handleChanges} handleCloseEventForm={handleCloseEventForm} />
                          </div>
                        )) : (
                          // Display if there is no events
                        <div className={"noEventsContainer"}>
                          <img src={noEventsSVG} alt="No ongoing events" />
                          <p><h4>No Events Created , Click <a onClick={toggleEventForm} style={{ color: '#0064E0', cursor: "pointer" }}>Create Events</a> to create your events</h4></p>
                        </div>
                      )
                      }

                    </div>
                  </div>) :
                    (
                      <Loader></Loader>
                    )}
                </div>
              }
              {
                // Tab to show the completed events
                tab === 'completed' &&
                <div className={`${"completed"} ${tab === 'completed' ? "displayPastEventTab" : "hidePastEventTab"}`}>
                  <div className={"eventStateContent"}>
                    <div className={"displayPastEvents"}>
                      <div id={"pastEventsContainer"}>
                        {pastEvents.length > 0 ?
                          (
                            pastEvents.map(event => (
                              <div className={"pastEventCard"} key={event.eventId}>
                                <h4>{event.eventName}</h4>
                                <p><BiCalendarCheck></BiCalendarCheck> {formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
                                <p><BiSolidHourglassBottom></BiSolidHourglassBottom> Duration: {setSessionDuration(event.appointmentDuration)}</p>
                                <button id={event.eventId} className='viewPastEvent'>View</button>
                              </div>
                            ))
                          ) : (
                            //  Display if there is no events
                            <div className={"noPastEventsContainer"}>
                              <img src={noData} alt="No ongoing events" />
                              <p><h4>No Past Events</h4></p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default OwnerDashboard