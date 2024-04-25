// Packages and hooks
import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Components
import Calender from "../components/Calender";
import EventDetails from '../components/EventDetails';
//Images 
import { FaArrowLeft } from "react-icons/fa";
import { IoEasel } from "react-icons/io5";

/**
 * @param {*} props userId and userType to render elements based on usertype and userId
 * @returns slot available to book and eventDetails from attendee
 *  For events owner - the events Details and Booked Appointments
 */
function Bookings(props) {
 let navigate = useNavigate()  
    const id = localStorage.getItem('selectedEventId')
    const { userId, userType } = props
    const [eventId, setEventId] = useState('')
    const [eventInfo, setEventInfo] = useState(null);
    const [bookedAppointmentsList, setBookedAppointmentsList] = useState([]);
    const [appointmentView, setAppointmentView] = useState(true);

   // To redirect the user to the appropriate page
    function backToDashboard() {
        if (userType === 'eventsOwner') {
            navigate('/owner/dashboard')
        }
        else {
            navigate('user/events')
        }

    }

    useEffect(() => {
        setEventId(id)
        if (userType !== 'eventsOwner') {
            setAppointmentView(false)
        }
        fetchEventDetails(id);
        fetchBookedAppointments(id);
    }, [id]);

    // To Fetch selected event Details
    const fetchEventDetails = (eventId) => {
        fetch(`/api/event/${eventId}`)
            .then(response => response.json())
            .then(data => setEventInfo(data))
            .catch(error => console.error('Error fetching event details:', error));
    };

    // To fetch booked appointments based on eventId 'For EventsOWner'
    const fetchBookedAppointments = (eventId) => {
        console.log(eventId);
        fetch(`/api/appointments/event/${eventId}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.json());
                    return response.json();

                } else {
                    throw new Error('Failed to fetch booked appointments');
                }
            })
            .then(data => setBookedAppointmentsList(data))
            .catch(error => console.error('Error fetching booked appointments:', error));
    };
    { console.log("EventInfo", eventInfo); }

    return (
        <div className="bookedAppointmentsmainContainer">
            {eventInfo && (
                <div className="eventAndBookedDetails">

                    {!appointmentView &&
                        // Render the component to display selected Event Details
                        <EventDetails eventInfo={eventInfo} setAppointmentView={setAppointmentView} userType={userType} />
                    }
                    <div className="bookedAppointmentsContainer" style={{ display: !appointmentView && 'none' }}>
                        <div className="bookedAppointmentsCalender"  >
                            <div className="viewSwapContainer">
                                <div className="eventDetailsHeader">
                                    <FaArrowLeft onClick={backToDashboard} style={{ cursor: "pointer" }}></FaArrowLeft>
                                    <h2>{eventInfo.eventName}</h2>
                                </div>

                                <button onClick={() => setAppointmentView(false)}><IoEasel /></button>
                            </div>
                            {/* Render Calender Component with Information based on user */}
                            {userType === "eventsOwner" ? <Calender action="viewAppointments" id={eventId}></Calender> :
                                <Calender id={eventId} eventInfo={eventInfo} userId={userId} action="viewSlots"></Calender>
                            }

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Bookings