// Packages and hooks
import { useState, useEffect } from "react"
import 'react-calendar/dist/Calendar.css';

// Components
import Loader from '../components/Loader.jsx';

// Images
import noEventsSVG from '../assets/noEventsAvailable.svg';
import EventCard from "../components/EventCard.jsx";

/**
 * Show the Event Available to the Attendee
 * @returns all the ongoing events 
 */
function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true);
    const date = new Date();

    useEffect(() => { //Render the event data from DB on loading the component
        fetchEvents();
    }, [])

    // Fetch Events Available to Attendee
    const fetchEvents = async () => {
        try {
            fetch(`/api/events`)
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
                })
                .catch((error) => {
                    console.log("Error", error)
                })
        }
        catch (e) {
            console.log("Error", e)
        }
        finally {
            setLoading(false); //Loading is set to false when events rendered
        }
    }

    return (
        <>
            {loading ?
                (
                    <Loader /> //Loader Component Activates if the event data isn't rendered
                ) :
                (
                    // To Display available events to the user
                    <div className="mainEventsContainer">
                        <div className="attendeeEventsheaderContainer" >
                            <h3>Events</h3>
                            <p>{date.toDateString()}</p>
                        </div>
                        <div className="attendeeMainEventsDashboard">
                            {events.length > 0 ? (<div className="atteendeedisplayEvent" id="events">
                                <div className="attendeeEvents">
                                    <div className="eventsContainer" id="eventsContainer">
                                        {events.map((event) =>(
                                            <div className={"eventCard"} key={event.eventId}>
                                                {/* Renders the Card Component from event Details */}
                                                <EventCard event={event} view={"attendeeView"} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>) :
                                (<div id="noappointmentsContainer" >
                                    <img src={noEventsSVG} alt="No ongoing events" />
                                    <p style={{ textAlign: "center" }}><h4>No Past Appointments Yet</h4></p>
                                </div>)
                            }
                        </div>
                    </div>
                )}

        </>
    )
}

export default Events