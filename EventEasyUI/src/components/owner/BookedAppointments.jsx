
import { setSessionDuration, formatDate } from "../../utils/dateFormatter.js";
import moment from 'moment';
import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import { Toast } from "../../utils/Notify.js";
import Calender from "../Calender.jsx";
import { BiCalendarCheck, BiHourglass, BiLaptop, BiMailSend } from 'react-icons/bi'

function BookedAppointments() {
    const { id} = useParams()
    const [eventInfo, setEventInfo] = useState(null);
    const [bookedAppointmentsList, setBookedAppointmentsList] = useState([]);
  
    console.log(id)
    useEffect(() => {
        fetchEventDetails(id);
        fetchBookedAppointments(id);
    }, []);

    const fetchEventDetails = (eventId) => {
        fetch(`http://localhost:3000/event/${eventId}`)
            .then(response => response.json())
            .then(data => setEventInfo(data))
            .catch(error => console.error('Error fetching event details:', error));
    };

    const fetchBookedAppointments = (eventId) => {
        fetch(`http://localhost:3000/event/${eventId}/appointments`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch booked appointments');
                }
            })
            .then(data => setBookedAppointmentsList(data))
            .catch(error => console.error('Error fetching booked appointments:', error));
    };

    const handleDeleteAppointment = (appointmentId, eventId) => {
        fetch(`http://localhost:3000/appointment/${appointmentId}/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            if (response.status === 200) {
                // Remove the deleted appointment from the list
                setBookedAppointmentsList(prevAppointments => prevAppointments.filter(appointment => appointment.appointmentId !== appointmentId));
                // Show success message
                await Toast.fire({
                    icon: 'success',
                    iconColor : 'success',
                    title: 'Appointment Deleted Successfully',
                  })
            } else {
                throw new Error('Failed to delete appointment');
            }
        })
        .catch(async error => {
            console.error('Error deleting appointment:', error);
            await Toast.fire({
                icon : 'error',
                title : 'Something went wrong',
                iconColor : 'error'
              })
        });
    };

   

    return (
        <div className="bookedAppointmentsmainContainer">
            {eventInfo && (
                <div className="eventAndBookedDetails">
                    <div className="eventDetails">
                        <h3>{eventInfo.eventName}</h3>
                        <p><BiCalendarCheck></BiCalendarCheck><b>Event Duration:</b> {formatDate(eventInfo.startDate)} - {formatDate(eventInfo.endDate)}</p>
                        <p><BiHourglass></BiHourglass> <b>Appointment Duration:</b> {setSessionDuration(eventInfo.appointmentDuration)}</p>
                        <p> <BiMailSend></BiMailSend> <b>Contact Mail :</b> {eventInfo.eventMail}</p>
                        <p><BiLaptop></BiLaptop> <b>Event Avaliable Days</b></p>
                        <table className="scheduleTable">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventInfo.eventDays.map(day => (
                                    <tr key={day.eventDay}>
                                        <td>{day.eventDay}</td>
                                        <td>{moment(day.startTime).format('HH:mm')}</td>
                                        <td>{moment(day.endTime).format('HH:mm')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bookedAppointmentsContainer">
                        {/* <div className="bookedAppointmentsDetails">
                        <h4>Booked Appointments</h4>
                        <table id="bookedAppointmentsTable">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Appointment Date</th>
                                    <th>Appointment Time</th>
                                    <th>Attendee Name</th>
                                    <th>Attendee Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookedAppointmentsList.map((appointment, index) => (
                                    <tr key={appointment.appointmentId}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(appointment.appointmentDate)}</td>
                                        <td>{moment(appointment.appointmentStartTime).format('HH:mm')}-{moment(appointment.appointmentEndTime).format('HH:mm')}</td>
                                        <td>{appointment.attendeeName}</td>
                                        <td>{appointment.attendeeMail}</td>
                                        <td><button className="btn btn-danger deleteButton" onClick={() => handleDeleteAppointment(appointment.appointmentId, appointment.attendeeId_eventId)}><i className="bi bi-x-circle-fill"></i></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div> */}
                        <div className="bookedAppointmentsCalender">
                            <Calender action="viewAppointments" id={id}></Calender>
                        </div>
                      
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookedAppointments;
