import styles from '../../styles/owner/PastEvents.module.css'
import {useState, useEffect } from "react"
import PropTypes from 'prop-types';
import Loader from '../Loader.jsx';
// import Link from 'react-router-dom'

// import { BiPencilSquare,BiTrashFill} from 'react-icons/bi'
import { formatDate , setSessionDuration} from "../../utils/dateFormatter.js"

import noData from '../../assets/noData.svg';

function PastEvents(props) {
    let {userId} = props
    console.log(userId)
    let [pastEvents , setPastEvents] = useState([])
    const [loading, setLoading] = useState([])
 useEffect(()=>{
    if(userId){
        fetchPastEvents();
    }
    },[userId])

    const fetchPastEvents = async () => {
            
        try {
            fetch(`http://localhost:3000/eventsOwner/${userId}/${"completed"}`)
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
        finally{
            setLoading(false);
        }
    }

    if(loading){
        <Loader></Loader>
    }
    PastEvents.prototypes ={
        userId : PropTypes.string
    }
  return (
    <div className={styles.contentleft}>
    <div className={styles.displayPastEvents}>
        <div id={styles.pastEventsContainer}>
        {pastEvents.length > 0 ? 
        ( 
       pastEvents.map(event =>(
           <div className={styles.peventCard} key={event.eventId}>
           <h3>{event.eventName}</h3>
           <p><i className="bi bi-calendar-check"></i> {formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
           <p><i className="bi bi-hourglass-bottom"></i> Duration: {setSessionDuration(event.appointmentDuration)}</p>
            <button id={event.eventId} className='viewPastEvent'>View Appointments</button>
         </div>
       ) ) 
       ): (
        <div className={styles.noPastEventsContainer}>
        <img src={noData} alt="No ongoing events" />
        <p><h4>No Past Events</h4></p>
    </div>
       ) }
        </div>
    </div>
</div>
  )
}

export default PastEvents