// Calendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate, formatForSpecificDate } from '../utils/dateFormatter';
import moment from 'moment';
import { FaCalendarCheck, FaCalendarWeek, FaClock, FaHourglassStart, FaTimes, FaTrashAlt } from 'react-icons/fa'
import noAppointment from '../assets/noAppointments.svg'
import { Toast } from '../utils/Notify'
import Swal from 'sweetalert2'
import deleteIcon from '../assets/delete.svg';

const Calender = (props) => {
  const { id, eventInfo, userId, action } = props
  
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([])
  // const dateAvailable = [new Date(2024 , 3 ,2)]; // Sample available dates
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookedAppointmentsList, setBookedAppointmentsList] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const [formData, setFormData] = useState({
    attendeeName: '',
    email: ''
  });
  // console.log(moment(availableDates).isLocal(), 'available')
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
        appointmentStartTime: moment(selectedAppointment.appointmentStartTime).valueOf(),
        appointmentEndTime: moment(selectedAppointment.appointmentEndTime).valueOf(),
      }
      return bookedAppointment
    }
    if (selectedAppointment) {
      let appointmentData = getFormData()

      try {
        console.log("Hi------");
        const response = await fetch('http://localhost:3000/appointment', {
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
          // Redirect to owner dashboard after a delay
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
        // setError("An error occurred. Please try again later.");
      }
      console.log("Booking form submitted with appointment details:", selectedAppointment);

    }

    setShowBookingForm(false)
  };

  useEffect(() => {
    if (action === 'viewAppointments') {
      const year = moment(date).year();
      const month = moment(date).month() + 1; // Month is zero-based, so add 1

      // Send month and year to the API or perform any action you need
      // getEventAvailableDays(year, month);
      let eventId = id
      let pickedDate = moment(date).format('YYYY-MM-DD')
      fetchTopBookedAppointments(eventId)
    }
  }, []);


  const fetchTopBookedAppointments = (eventId) => {
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

  useEffect(() => {
    // let events;
    // try {

    //     fetch(`http://localhost:3000/events/month/${monthYear}/${id}`, {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //     })
    //         .then(async response => {
    //             if (response.status === 200) {
    //                 events = await response.json();
    //                 console.log("Response=: ", events);
    //                 if (events.length > 0) {
    //                      await setEvents(events);

    //                 }
    //                 else {
    //                   setEvents([])
    //                     // console.log("..................Coming Here....................");
    //                 }


    //             }
    //         })
    //         .catch(err => {
    //             console.log("Error: ", err);
    //         })
    // }

    // catch (err) {
    //   console.log("Error", err);
    // }


    // Load events for selected date (mock implementation)
    // const filteredEvents = availableDates.filter(d => d.toDateString() === date.toDateString());

    if (action === 'viewSlots') {
      getAppointments(date)
      const year = moment(date).year();
      const month = moment(date).month() + 1;

      getEventAvailableDays(year, month);
    }
    if (action === 'viewAppointments') {
      const year = moment(date).year();
      const month = moment(date).month() + 1; // Month is zero-based, so add 1

      // Send month and year to the API or perform any action you need
      // getEventAvailableDays(year, month);
      let eventId = id
      let pickedDate = moment(date).format('YYYY-MM-DD')
      fetchBookedAppointments(eventId, pickedDate)
    }

  }, [date]);

  const convertEpochToFormattedDate = (epochTime) => {
    const formattedDate = moment(parseInt(epochTime)).format('YYYY-MM-DD');
    console.log('Converted Date:', formattedDate);
    return formattedDate;
  };

  const getEventAvailableDays = (year, month) => {
    fetch(`http://localhost:3000/events/month/${year}-0${month}/${id}`)
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

  const fetchBookedAppointments = (eventId, selectedDate) => {
    fetch(`http://localhost:3000/${eventId}/appointments/${selectedDate}`)
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

  async function getAppointments(selectedSlotDate) {
    let appointmentInfo;
    selectedSlotDate = formatForSpecificDate(selectedSlotDate)
    console.log(selectedSlotDate);
    fetch(`http://localhost:3000/event/appointments/${id}/${selectedSlotDate}`)
      .then((response) => {
        if (!response.ok) {
          console.log("Error:No Appointments avaliable")
          //  slotContainer.innerHTML = `${loadSVG(`<h3>No appointments are available on ${formatDate(selectedSlotDate)}</h3>`, '../../assets/allappointmentsBooked.svg')}`;
        }
        return response.json();
      })
      .then((items) => {
        console.log("Appointments avaliable", items);
        appointmentInfo = items;
        setAppointments(appointmentInfo);
        if (appointmentInfo.length == 0) {
          setAppointments([])
          // slotContainer.innerHTML = `${loadSVG(`<h3>No appointments are available on ${formatDate(selectedSlotDate)}</h3>`, '../../assets/allappointmentsBooked.svg')}`;
        }
      })
      .catch((error) => {

        console.error("Fetch Error: ", error);
      });
  }



  const handleDateChange = newDate => {
    setDate(newDate);
    // Extract month and year from the active start date
    const year = moment(newDate).year();
    const month = moment(newDate).month() + 1; // Month is zero-based, so add 1

    // Send month and year to the API or perform any action you need
    // getEventAvailableDays(year, month);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setShowBookingForm(true);
  };
  function handleClick() {
    setShowBookingForm(true);
  }

  const handleDeleteAppointment = (appointmentId, eventId) => {

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
  });
    
};

  function handleCloseModel() {
    setShowBookingForm(false);
  }

  const handleViewChange = ({ activeStartDate, view }) => {
    console.log('View changed:', view);
    if (view === 'month') {
      const year = moment(activeStartDate).year();
      const month = moment(activeStartDate).month() + 1;
      console.log('Year:', year, 'Month:', month);
      // Perform actions based on month and year change
      getEventAvailableDays(year, month);
    }
  };

  return (
    <>
      <div className="calendar-container">
        <div className="calendar">
          <Calendar
            onChange={handleDateChange}
            // onViewChange={handleViewChange}
            onActiveStartDateChange={handleViewChange}
            minDate={action === 'viewSlots' && new Date()}
            // onClickMonth={handleViewChange}
            value={date}
            // minDate={moment(startDate).format('YYYY-MM-DD')}
            // maxDate={moment(endDate).format('YYYY-MM-DD')}
            tileContent={({ date, view }) =>


              view === 'month' && availableDates.find(d => d === moment(date).format('YYYY-MM-DD')) ? (
                <div className="event-badge">🔵{console.log("Date", date, view)}</div>
              ) : null
            }
          />
        </div>

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
                  <p><FaHourglassStart className='modelIcon'></FaHourglassStart>Appointment Time: {moment(selectedAppointment.appointmentStartTime).format('LT')} - {moment(selectedAppointment.appointmentEndTime).format('LT')}</p>
                </div>
                <form onSubmit={handleFormSubmit} >
                  <h4>Plese Enter Your Details</h4>
                  {/* Add form fields (e.g., name, email, etc.) */}
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
      {action === 'viewSlots' &&
        <div className="event-details">
          <h3>Appointments</h3>
          {console.log(events, "Appointments", appointments)}
          <h4>Appointments on {date.toDateString()}</h4>
          {appointments.length > 0 ? (
            <div>
              <p>No of Appointments : {appointments.length}</p>
              <ul className='appointmentsAvailable'>
                {appointments.map((appointment, index) => (
                  <li key={index} onClick={() => handleAppointmentSelect(appointment)}>
                    {/* Adjust rendering of appointment details here */}
                    <p> <FaClock style={{ "color": "gray" }} /> Time: {moment(appointment.appointmentStartTime).format('HH:mm')}-{moment(appointment.appointmentEndTime).format('HH:mm')}</p>
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
          {bookedAppointmentsList.length > 0 ? (
            <div className="bookedAppointmentsTable">
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
                      <td><button className="btn btn-danger deleteButton" onClick={() => handleDeleteAppointment(appointment.appointmentId, appointment.attendeeId_eventId)}><FaTrashAlt></FaTrashAlt></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='noAppointments'>
              <img src={noAppointment} alt="" />
              <p>No appointments available on {formatDate(date)}</p>
            </div>
          )
          }


        </div>
      }
    </>
  );
};

export default Calender;
