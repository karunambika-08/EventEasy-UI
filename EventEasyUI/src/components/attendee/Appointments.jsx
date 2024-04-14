/* eslint-disable no-unused-vars */
// import React from 'react'

import { FaCalendarCheck, FaCalendarPlus, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from '../Loader';
import { formatDate } from "../../utils/dateFormatter.js"
import moment from 'moment';
import Swal from 'sweetalert2';
import deleteIcon from '../../assets/delete.svg';
import noData from '../../assets/noData.svg';
import { Link } from 'react-router-dom';


function Appointments(props) {
    // eslint-disable-next-line react/prop-types
    const { userId } = props
    Appointments.prototype = {
        userId: PropTypes.string
    }
    console.log(userId, "Created");
    const [tab, setTab] = useState('Booked');
    const [loading, setLoading] = useState(true);
    const [bookedAppointments, setBookedAppointments] = useState([])
    const [AttendedAppointments, setAttendedAppointments] = useState([])

    const [count, setCount] = useState(1);
    // useHistory hook for navigation

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

    const fetchPastEvents = async () => {

        try {
            fetch(`http://localhost:3000/attendee/${userId}/appointments/${"completed"}`)
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

    async function handleDelete(targetId, eventId) {
        console.log(eventId)

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
                    const response = await fetch(`http://localhost:3000/appointment/${targetId}/${eventId}`, {
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

    const fetchEvents = async () => {

        try {
            fetch(`http://localhost:3000/attendee/${userId}/appointments/${"booked"}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        let jsonData = await response.json();
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

    return (
        <>
            {loading ?
                (<Loader />) :
                (<div className={"displayAppointments"}>

                    <div className={"appointmentstabs"}>
                        <div className={"swapbtnBox"}>
                            {/* <!-- <button><i className="bi bi-calendar2-check"></i> Confirmed</button> --> */}
                            <button id="tabBtn1"
                                className={tab === 'Booked' ? "activeAppointmentTab" : ''}
                                onClick={openBooked}> <FaCalendarPlus className='AppointmentstabIcon' style={{ marginRight: "10px" }}></FaCalendarPlus>Booked</button>
                            <button id="tabBtn2"
                                className={tab === 'Attended' ? "activeAppointmentTab" : ''}
                                onClick={openAttended}><FaCalendarCheck className='AppointmentstabIcon' style={{ marginRight: "10px" }} ></FaCalendarCheck>Attended</button>
                            {/* <!-- <button>Denied</button> --> */}
                        </div>
                        <div id="leftcontent" className={`${"tabContent"} ${tab === 'Booked' ? "displayActiveTab" : "hideInactiveTab"}`}>
                            {bookedAppointments.length > 0 ?
                                (<div className="bookedAppointmentsContainer" >
                                    <div id="dateRangePicker">
                                        <label htmlFor="date"><i className="bi bi-search"></i> Search a date</label>
                                        <input type="date" id="onGoingdateInput" className="searchInput" name="date" />
                                    </div>
                                    <h5>Upcoming Appointments</h5>
                                    <table id="bookedAppointmentsTable">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Appointment</th>
                                                <th>Appointment Date</th>
                                                <th>Appointment Time</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                bookedAppointments.map((row, index) => (
                                                    <tr key={row.appointmentId}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.eventName}</td>
                                                        <td>{formatDate(row.appointmentDate)}</td>
                                                        <td>{`${moment(row.appointmentStartTime).format('HH:mm')}-${moment(row.appointmentEndTime).format('HH:mm')}`}</td>
                                                        <td className='appointmentAction'><button onClick={() => handleDelete(row.appointmentId, row.attendeeId_eventId)} className='abtn'><FaTrash className='appointmentDelBtn'></FaTrash></button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>) :
                                (<div id="noappointmentsContainer" >
                                    <img src={noData} alt="No ongoing events" />
                                    <p style={{ textAlign: "center" }}><h4>No Appointments Booked Yet <br /></h4> <p>Click Here <Link to={'/user/events'}>Event</Link> to explore and Book Appointment</p></p>
                                </div>)}
                        </div>
                        <div id="rightcontent" className={`${"tabContent"} ${tab === 'Attended' ? "displayActiveTab" : "hideInactiveTab"}`}>

                            {AttendedAppointments.length > 0 ?
                                (<div className="pastAppointmentsContainer">
                                    <h5>Past Appointments</h5>
                                    <table id="bookedAppointmentsTable">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Appointment</th>
                                                <th>Appointment Date</th>
                                                <th>Appointment Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                bookedAppointments.map((row, index) => (
                                                    <tr key={row.appointmentId}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.eventName}</td>
                                                        <td>{formatDate(row.appointmentDate)}</td>
                                                        <td>{`${moment(row.appointmentStartTime).format('HH:mm')}-${moment(row.appointmentEndTime).format('HH:mm')}`}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>) :
                                (<div id="noappointmentsContainer" >
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