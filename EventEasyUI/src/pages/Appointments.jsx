
// Packages and hooks
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

//Images and utils
import deleteIcon from '../assets/delete.svg';
import noData from '../assets/noData.svg';
import { formatDate } from "../utils/dateFormatter.js"
import { FaCalendarCheck, FaCalendarPlus, FaTrashAlt } from 'react-icons/fa'

//Components
import Loader from '../components/Loader.jsx';
import Table from '../components/Table.jsx';

/**
 * This Function is for loading Appointments booked and attended by users
 * @param {*} props userId - Inorder to load appointments based on user
 * @returns Appointments booked and attended by users
 */
function Appointments(props) {
    const [userId, setUserId] = useState(() => {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser || '';
    });

    const [tab, setTab] = useState('Booked'); //To change the Booking and Attended tabs
    const [loading, setLoading] = useState(true); //To handle loader componet
    const [bookedAppointments, setBookedAppointments] = useState([])
    const [AttendedAppointments, setAttendedAppointments] = useState([])

    // Function switch tab for Booked and Attended Appointments
    function openBooked() {
        setTab('Booked');
    }

    function openAttended() {
        setTab('Attended');
    }


    useEffect(() => {
        setLoading(false);
    }, [bookedAppointments]);


    useEffect(() => {
        if (userId) {
            fetchEvents();
        }
    }, [userId])

    useEffect(() => {
        if (tab === 'Attended') {
            fetchPastEvents();
        }
    }, [tab]);

    /**
    * Fectch Present Booked Event of user
    */
    const fetchEvents = async () => {
        try {
            fetch(`/api/attendee/${userId}/appointments/${"booked"}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        let jsonData = await response.json();
                        console.log(jsonData);
                        return jsonData;
                    }
                })
                .then(async (response) => {
                    console.log("Response", response);
                    setBookedAppointments(response)
                    console.log("Events", bookedAppointments);
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

    /**
     * Fectch Events attended by user
     */
    const fetchPastEvents = async () => {
        try {
            fetch(`/api/attendee/${userId}/appointments/${"completed"}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        let jsonData = await response.json();
                        return jsonData;
                    }
                })
                .then(async (response) => {
                    console.log("Response", response);
                    setAttendedAppointments(response)
                    console.log("Events", AttendedAppointments);
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

    /**
     * Fnction  to delete a booked appointment
     * @param {*} targetId 
     * @param {*} eventId 
     */
    async function handleDelete(targetId, eventId) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            imageUrl: deleteIcon,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Are you sure you want to delete",
            showCancelButton: true,
            confirmButtonColor: "#0064E0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            console.log(result.isConfirmed);
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/appointment/${targetId}/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const jsonData = await response.json();
                        setBookedAppointments(bookedAppointments.filter(appointment => appointment.appointmentId !== targetId));
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                            color: '#0064E0'
                        });
                        console.log(jsonData);
                    }
                    else {
                        const errorMessage = await response.text();
                        throw new Error(errorMessage);
                    }
                }

                catch (err) {
                    console.error('Error deleting event:', err);
                    Swal.fire({
                        title: "Something went wrong",
                        text: "Error in deleting event",
                        icon: "error"
                    });
                }

            }
        });
    }


    return (
        <>
            {loading ?

                (
                    <Loader /> //Loader Component Activates if the event data isn't rendered
                ) :
                (
                     // To Display Appointments related (booked and Attended) to the user
                    <div className={"displayAppointments"}>
                        <div className="appointmentsHeaderContainer">
                            <h3 className="appointmentsHeader">Your Appointments</h3>
                        </div>
                        <div className={"appointmentstabs"}>
                            <div className={"appointmentState"}>
                                <button
                                    className={tab === 'Booked' ? "activeAppointmentTab" : ''}
                                    onClick={openBooked}> <FaCalendarPlus className='AppointmentstabIcon' style={{ marginRight: "10px" }}></FaCalendarPlus>Booked</button>
                                <button
                                    className={tab === 'Attended' ? "activeAppointmentTab" : ''}
                                    onClick={openAttended}><FaCalendarCheck className='AppointmentstabIcon' style={{ marginRight: "10px" }} ></FaCalendarCheck>Attended</button>
                            </div>
                            {/* Booked Appointments Tab */}
                            <div className={`${"appointmenttabContent"} ${tab === 'Booked' ? "displayActiveTab" : "hideInactiveTab"}`}>
                                {bookedAppointments.length > 0 ?
                                    (<div className="bookedAppointmentsContainer" >
                                        <h4 className='bookedAppointmentssubheader'>Upcoming Appointments</h4>
                                        <Table
                                            tableType='bookedAppointmentsTable'
                                            tablecolumns={['S.No', 'Appointment', 'Appointment Date', 'Appointment Time', 'Actions']}
                                            tablerows={bookedAppointments.map((row, index) => ({
                                                'S.No': index + 1,
                                                'Appointment': row.eventName,
                                                'Appointment Date': formatDate(row.appointmentDate),
                                                'Appointment Time': `${moment(row.appointmentStartTime).format('HH:mm')}-${moment(row.appointmentEndTime).format('HH:mm')}`,
                                                'Actions': (
                                                    <FaTrashAlt className="appointmentDelBtn"
                                                        onClick={() => handleDelete(row.appointmentId, row.attendeeId_eventId)}
                                                        style={{ cursor: 'pointer' }} />
                                                ),
                                            }))}
                                        />
                                    </div>) :
                                    (
                                        // Rendered if there are no appoinments related to the user 
                                    <div id="noappointmentsContainer" >
                                        <img src={noData} alt="No ongoing events" />
                                        <p style={{ textAlign: "center" }}><h4>No Appointments Booked Yet <br /></h4> <p>Click Here <Link to={'/user/events'}>Event</Link> to explore and Book Appointment</p></p>
                                    </div>)}
                            </div>
                            {/* Attended Appointments Tab */}
                            <div className={`${"appointmenttabContent"} ${tab === 'Attended' ? "displayActiveTab" : "hideInactiveTab"}`}>
                                {AttendedAppointments.length > 0 ?
                                    (<div className="pastAppointmentsContainer">
                                        {console.log('AttendedApoointmentss', AttendedAppointments)}
                                        <h5 className='pastAppointmentssubHeader'>Past Appointments</h5>
                                        <Table
                                            tableType='bookedAppointmentsTable'
                                            tablecolumns={['S.No', 'Appointment', 'Appointment Date', 'Appointment Time']}
                                            tablerows={AttendedAppointments.map((row, index) => ({
                                                'S.No': index + 1,
                                                'Appointment': row.eventName,
                                                'Appointment Date': formatDate(row.appointmentDate),
                                                'Appointment Time': `${moment(row.appointmentStartTime).format('HH:mm')}-${moment(row.appointmentEndTime).format('HH:mm')}`,
                                            }))}
                                        />
                                    </div>) :
                                    (
                                    // Rendered if there are no appoinments related to the user 
                                    <div id="noappointmentsContainer" >
                                        
                                        <img src={noData} alt="No ongoing events" />
                                        <p style={{ textAlign: "center" }}><h4>No Past Appointments Yet</h4></p>
                                    </div>)
                                }

                            </div>

                        </div>
                    </div>)}

        </>
    )
}

export default Appointments