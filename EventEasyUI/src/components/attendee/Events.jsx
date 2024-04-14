// Packages and hooks
import { useState, useEffect } from "react"
import { formatDate, setSessionDuration } from "../../utils/dateFormatter.js"
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { FaCalendarCheck, FaCalendarWeek, FaClock, FaHourglassStart, FaTimes } from 'react-icons/fa'

// Components
import Loader from '../Loader';

// Images
import noEventsSVG from '../../assets/noEventsAvailable.svg';
import { BiCalendarCheck, BiSolidHourglassBottom } from 'react-icons/bi'
import Calender from "../Calender.jsx";

function Events() {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true);
    const [calendarView, setCalendarView] = useState(false)

    const [date, setDate] = useState(new Date());
    const [calenderevents, setCalenderEvents] = useState([]);
    const availableDates = [new Date(2024, 3, 15), new Date(2024, 3, 20)]; // Sample available dates

    useEffect(() => {
        // Load events for selected date (mock implementation)
        const filteredEvents = availableDates.filter(d => d.toDateString() === date.toDateString());
        setEvents(filteredEvents);
    }, [date]);

    const handleDateChange = newDate => {
        setDate(newDate);
    };


    useEffect(() => {
        fetchEvents();
    }, [])
    const fetchEvents = async () => {
        try {
            fetch(`http://localhost:3000/events`)
                .then(async (response) => {
                    if (response.status === 200) {
                        let jsonData = await response.json();
                        return jsonData;
                    }
                })
                .then(async (response) => {
                    console.log("Response", response);
                    setEvents(response)
                    console.log("Events", events);
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

    function handleViewAppointment(event) {
        localStorage.setItem('selectedEvent', JSON.stringify(event));
        console.log('Events-->', event)
        navigate(`/user/events/booking/${event.eventId}`);
    }

    function handleViewChange(isCalendar) {
        isCalendar = !isCalendar
        setCalendarView(isCalendar)
    }
    return (

        <>
            {loading ? (<Loader />) : (
                <div className="mainEventsContainer">
                    <div className="aheaderContainer" id="aheaderContainer">
                        <h3> {calendarView ? "Event Calender" : "Events"}</h3>
                        <button className="calenderViewBtn" id="calenderViewBtn" onClick={() => handleViewChange(calendarView)}>{calendarView ? "Events View" : "Calender View"}  </button>
                    </div>
                    {!calendarView ? (
                        <div className="attendeeMainEventsDashboard">
                            {events.length > 0 ? (<div className="atteendeedisplayEvent" id="events">
                                <div className="aeventsContainer" id="eventsContainer">
                                    {events.map((event) => (
                                        <div className={"aEventCard"} key={event.eventId}>
                                            <h3>{event.eventName}</h3>
                                            <p className={"aeventDetails"}><BiCalendarCheck className={"aeventCardIcon"} /> <span> {formatDate(event.startDate)} - {formatDate(event.endDate)}</span></p>
                                            <p className={"aeventDetails"}><BiSolidHourglassBottom className={"eventCardIcon"} /> Duration: {setSessionDuration(event.appointmentDuration)}</p>
                                            <button id={event.eventId} className={"viewEvent"} onClick={() => handleViewAppointment(event)}>Appointments</button>
                                        </div>
                                    ))}
                                </div>
                            </div>) :
                                (<div id="noappointmentsContainer" >
                                    <img src={noEventsSVG} alt="No ongoing events" />
                                    <p style={{ textAlign: "center" }}><h4>No Past Appointments Yet</h4></p>
                                </div>)
                            }

                        </div>
                    ) : (
                        // <div className="attendeeMainEventsDashboard"> 
                        // <div className="calendarview-container">
                        //     <div className="calendarview">
                        //         <Calendar
                        //             onChange={handleDateChange}
                        //             value={date}
                        //             tileContent={({ date, view }) =>
                        //                 view === 'month' && availableDates.find(d => d.toDateString() === date.toDateString()) ? (
                        //                     <div className="event-badge">•</div>
                        //                 ) : null
                        //             }
                        //         />
                        //     </div>
                        //     <div className="calendarViewevent-details">
                        //         <h2>Events on {date.toDateString()}</h2>
                        //         {calenderevents.length > 0 ? (
                        //             <ul>
                        //                 {events.map((event, index) => (
                        //                     <li key={index}>{event.toDateString()} - Event Details...</li>
                        //                 ))}
                        //             </ul>
                        //         ) : (
                        //             <p>No events available for this day.</p>
                        //         )}
                        //     </div>
                        // </div>
                        // </div>
                        <Calender/>
                    )}

                </div>
            )}

        </>
    )
}

export default Events