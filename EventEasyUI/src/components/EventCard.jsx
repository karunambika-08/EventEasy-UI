// Packages and hooks
import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Images and utils
import { BiCalendarCheck, BiSolidHourglassBottom, BiEdit, BiTrash } from 'react-icons/bi'
import { setSessionDuration, formatDate } from "../utils/dateFormatter.js";
// Component
import EventForm from '../components/EventForm'
// Component to create card from given event details
function EventCard(props) {
  let navigate = useNavigate()
  const { event, userId, handleDelete, handleChanges, view } = props
  const [isEditFormActive, setIsEditFormActive] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const toggleEditForm = (event) => {
    setEditingEvent(event);
    setIsEditFormActive(!isEditFormActive);
  };

  const handleCloseModal = () => {
    setEditingEvent(false);
  };

  function handleViewAppointment(eventId) {
    localStorage.setItem('selectedEventId', eventId)
    navigate(`/owner/dashboard/event/appointments`)
  }

  function handleViewEventDetails(eventId) {
    localStorage.setItem('selectedEventId', (eventId));
    navigate(`/user/events/booking`);
  }
  return (
    <>
      <h3 className='eventCardHeader'>{event.eventName}</h3>
      <p className={"eventCardDetails"}><BiCalendarCheck className={"eventCardIcon"} /> <span> {formatDate(event.startDate)} - {formatDate(event.endDate)}</span></p>
      <p className={"eventCardDetails"}><BiSolidHourglassBottom className={"eventCardIcon"} /> Duration: {setSessionDuration(event.appointmentDuration)}</p>
      {view === 'attendeeView' ?
        <button id={event.eventId} className={"viewEvent"} onClick={() => handleViewEventDetails(event.eventId)}>Appointments</button>
        :
        <div className={"manipulateCard"}>
          <button id={event.eventId} className={"editEvent"} onClick={() => toggleEditForm(event)} ><BiEdit></BiEdit></button>
          <button className={"deleteEvent"} onClick={() => handleDelete(event.eventId)}><BiTrash></BiTrash></button>
          <button id={event.eventId} className={"viewEvent"} onClick={() => handleViewAppointment(event.eventId)}>Appointments</button>
        </div>

      }
      {(isEditFormActive && editingEvent) &&
        <div className={"overlayContainer"} style={{ display: isEditFormActive ? "flex" : "none" }} onClick={handleCloseModal}>
          <div className={"popupBox"} onClick={(e) => e.stopPropagation()}>
            <EventForm
              userId={userId}
              onClose={handleCloseModal}
              initialEvent={editingEvent}
              handleChanges={handleChanges}
            />
          </div>
        </div>
      }
    </>
  )
}

export default EventCard