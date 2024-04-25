// Packages and Hooks
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

//Images and utils
import { formatDate, formatForSpecificDate,convertEpochToFormattedDate } from '../utils/dateFormatter';
import { FaCalendarCheck, FaCalendarWeek, FaClock, FaHourglassStart, FaTimes, FaTrashAlt } from 'react-icons/fa'
import noAppointment from '../assets/noAppointments.svg'
import { deleteAlert,Toast } from "../utils/Notify";

// Componets
import Table from './Table';

// Component to render calender and details based on userId and action
const Calender = (props) => {
  const { id, eventInfo, userId, action } = props 
  const [date, setDate] = useState(new Date()); // To set Calender date
  const [endDate ,setEndDate] = useState(); // To set Calender
  const [selectedSlot, setSelectedSlot] = useState(null); //Attendee slot Booking : selected Slots
  const [slots, setSlots] = useState([]); //Attendee Slots Booking : To store available slots details of an event

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookedAppointmentsList, setBookedAppointmentsList] = useState([]);
  
  const [availableDates, setAvailableDates] = useState([]); //To mark the slots of events in a calendar

  const [formData, setFormData] = useState({
    attendeeName: '',
    email: ''
  });

  useEffect(() => {
    if(eventInfo){
      setEndDate(eventInfo.endDate)
    }
    if (action === 'viewSlots') {
      getSlots(date)
      const year = moment(date).year();
      const month = moment(date).month() + 1;
      getEventSlotAvailableDays(year, month);
    }
    if (action === 'viewAppointments') {
      let eventId = id
      let pickedDate = moment(date).format('YYYY-MM-DD')
      fetchBookedAppointments(eventId, pickedDate)
    }

  }, [date]);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    function getFormData() {
      let bookedAppointment = {
        eventId: id,
        eventName: eventInfo.eventName,
        attendeeId: userId,
        attendeeName: formData.attendeeName,
        attendeeMail: formData.email,
        appointmentDate: moment(date).valueOf(),
        appointmentStartTime: moment(selectedSlot.appointmentStartTime).valueOf(),
        appointmentEndTime: moment(selectedSlot.appointmentEndTime).valueOf(),
      }
      return bookedAppointment
    }
    if (selectedSlot) {
      let appointmentData = getFormData()

      try {
       
        const response = await fetch('/api/appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointmentData)
        });
        const data = await response.json();
        console.log("Data->", data);
        if (response.ok) {
          await Toast.fire({
            icon: 'success',
            iconColor: 'success',
            title: 'Appointment Booked Successfully',
          })
          
          let updatedSlots = slots.filter((appointment)=> appointment.appointmentStartTime !== appointmentData.appointmentStartTime)
        setSlots(updatedSlots);

          console.log("New Appointments-->",updatedSlots);
          // Redirect to owner  dashboard after a delay
          setTimeout(() => {
            
            setShowBookingForm(false)
          }, 2000);
        } else {
          await Toast.fire({
            icon: 'error',
            title: 'Something went wrong',
            iconColor: 'error'
          })
          console.log("Server Error")
        }
      } catch (error) {
        await Toast.fire({
          icon: 'error',
          title: 'Something went wrong',
          iconColor: 'error'
        })
        console.log('Error:', error);
      }
      console.log("Booking form submitted with appointment details:", selectedSlot);

    }

    setShowBookingForm(false)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 const getEventSlotAvailableDays = (year, month) => {
    fetch(`/api/events/month/${year}-0${month}/${id}`)
      .then(async (response) => {
        if (response.status === 200) {
          const eventsDate = await response.json();
          if (eventsDate.length > 0) {

            let formattedDate = eventsDate.map((epochTime) => {
              return convertEpochToFormattedDate(epochTime);
            })
            setAvailableDates(formattedDate);
            console.log(availableDates);
          }

        } else {
          // Handle error if fetching data fails
          console.log('Error: Failed to fetch available dates');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  // Attendee View , Slots View Call
  async function getSlots(selectedSlotDate) {
    let appointmentInfo;
    selectedSlotDate = formatForSpecificDate(selectedSlotDate)
    console.log(selectedSlotDate);
    fetch(`/api/event/appointments/${id}/${selectedSlotDate}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Error:No Appointments avaliable")
        }
        return response.json();
      })
      .then((items) => {
        console.log("Appointments avaliable", items);
        appointmentInfo = items;
        setSlots(appointmentInfo);

        if (appointmentInfo.length == 0) {
          setSlots([])
        }
      })
      .catch((error) => {

        console.error("Fetch Error: ", error);
      });
  }


  // Events Owner View : Owner Based Appointments
  const fetchBookedAppointments = (eventId, selectedDate) => {
    fetch(`/api/${eventId}/appointments/${selectedDate}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to fetch booked appointments');
        }
      })
      .then(data => {
        if (data.length > 0) {
          setBookedAppointmentsList(data)
        }
        else {
          setBookedAppointmentsList([]);
        }
      })

      .catch(error => console.error('Error fetching booked appointments:', error));
  };

  //To handle the date change for the calender
  const handleDateChange = newDate => {
    setDate(newDate);
  };

  //To handle the book of a selected slot
  const handleAppointmentSelect = (appointment) => {
    setSelectedSlot(appointment);
    setShowBookingForm(true);
  };

  function handleClick() {
    setShowBookingForm(true);
  }
//Handle Deleting of booked appointment to update the display
  const handleDeleteAppointment =async (appointmentId, eventId) => {
    const deleteResult = await deleteAlert();
      if (deleteResult.isConfirmed) {
        fetch(`/api/appointment/${appointmentId}/${eventId}`, {
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
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                color: '#0064E0',
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

      }
    
};

  //To the the booking form open and close
  function handleCloseModel() {
    setShowBookingForm(false);
  }

  //To handle the view change of the calendar month
  const handleViewChange = ({ activeStartDate, view }) => {
    console.log('View changed:', view);
    if (view === 'month') {
      const year = moment(activeStartDate).year();
      const month = moment(activeStartDate).month() + 1;
      console.log('Year:', year, 'Month:', month);
      // Perform actions based on month and year change
      if(action === 'viewSlots'){
        getEventSlotAvailableDays(year, month);
      }
    }
  };

  return (
      <div className="calendar-container">
        <div className="calendar">
          <Calendar 
            onChange={handleDateChange}
           onActiveStartDateChange={handleViewChange}
            minDate={action === 'viewSlots' && new Date()}
            maxDate={new Date(endDate)}
            value={date}
            tileContent={({ date, view }) =>
              view === 'month' && availableDates.find(d => d === moment(date).format('YYYY-MM-DD')) ? (
                <p className="event-badge">•</p>
              ) : null
            }
          />
      
        </div>
        {action === 'viewSlots' &&
        <div className="slot-details">
           <h3>Appointments</h3>
           <hr />
           
          
          {slots.length > 0 ? (
            <div>
             
              <div className="appointmentsSubheader">
              <p><b>No of Slots: {slots.length}</b></p>
              </div>
             
              <ul className='appointmentsAvailable'>
                {slots.map((appointment, index) => (
                  <li key={index} onClick={() => handleAppointmentSelect(appointment)}>
                    {/* Adjust rendering of appointment details here */}
                    <p className='slots'> <FaClock className='slotsImg' /> Time: {moment(appointment.appointmentStartTime).format('HH:mm')}-{moment(appointment.appointmentEndTime).format('HH:mm')}</p>
                    <button onClick={handleClick}>Book</button>
                    {/* Additional appointment details can be rendered here */}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='noAppointments'>
              <img src={noAppointment} alt="" />
              <p>No appointments available on {formatDate(date)}</p>
            </div>
          )}
        </div>
      }
      {action === 'viewAppointments' &&
        <div className="bookedAppointmentsDetails">
           <h3>Booked Appointments</h3>
           <hr style={{margin: '5px 15px 0px 0px'}} />
          {bookedAppointmentsList.length > 0 ? (
            <>
              <p className='noofappointments'><b>No of appointments: {bookedAppointmentsList.length}</b></p>
              <Table
                                            tableType = 'bookedAppointmentsTable'
                                            tablecolumns={['S.No', 'Appointment Date', 'Appointment Time','Attendee Name','Attendee Email', 'Actions']}
                                            tablerows={bookedAppointmentsList.map((appointment, index) => ({
                                                'S.No': index + 1,
                                                'Appointment Date': formatDate(appointment.appointmentDate),
                                                'Appointment Time': `${moment(appointment.appointmentStartTime).format('HH:mm')}-${moment(appointment.appointmentEndTime).format('HH:mm')}`,
                                                'Attendee Name' : appointment.attendeeName,
                                                'Attendee Email': appointment.attendeeMail,
                                                'Actions': (
                                                   
                                                        <FaTrashAlt 
                                                        className="bookedappointmentDelBtn"  
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => handleDeleteAppointment(appointment.appointmentId, appointment.attendeeId_eventId)}/>
                                                  
                                                )
                                            }))}
                                        />
             </>
          ) : (
            <div className='noAppointments'>
               
              <img src={noAppointment} alt="" />
              <p>No appointments available on {formatDate(date)}</p>
            </div>
          )
          }


        </div>
      }
        {showBookingForm &&
          <div className="bookingModelContainer">
            <div className="bookingModelContent">
              <div className="booking-form">
                <div className="bookingModelHeader">
                  <h3>Book Appointment</h3>
                  <p onClick={handleCloseModel} style={{ cursor: 'pointer', color: '#0064E0' }}><FaTimes></FaTimes></p>
                </div>
                <div className="bookingModelDetailsContainer">
                  <h4>Appointments Details</h4>
                  <p><FaCalendarWeek className='modelIcon'></FaCalendarWeek>{eventInfo.eventName}</p>
                  <p><FaCalendarCheck className='modelIcon'></FaCalendarCheck>Appointment Date: {formatDate(date)}</p>
                  <p><FaHourglassStart className='modelIcon'></FaHourglassStart>Appointment Time: {moment(selectedSlot.appointmentStartTime).format('LT')} - {moment(selectedSlot.appointmentEndTime).format('LT')}</p>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <h4>Plese Enter Your Details</h4>
                  <input type="text" placeholder="Name" name="attendeeName" value={formData.attendeeName}
                    onChange={handleInputChange} />
                  <input type="email" placeholder="Email" name="email" value={formData.email}
                    onChange={handleInputChange} />
                  <button type="submit">Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        }
      </div>

  );
};

export default Calender;
