import { useState, useEffect } from 'react';
import { BiMailSend, BiPlus, BiX, BiCalendarCheck, BiHourglass, BiLaptop } from 'react-icons/bi';
import moment from 'moment';
import '../App.css';
import { Toast } from '../utils/Notify'
import { formatDate, setSessionDuration } from '../utils/dateFormatter';
import { FaCalendarWeek } from 'react-icons/fa';
import Table from './Table';

function EventForm(props) {
  const { userId, onClose, initialEvent, handleChanges } = props;
  const currentDate = moment().format('YYYY-MM-DD');
  let defaultDate = moment().format('YYYY-MM-DD');
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0)
  

 
  
  const [eventFormData, setEventFormData] = useState(
    {
      eventName: '',
      eventMail: '',
      startDate: defaultDate,
      endDate: defaultDate,
      appointmentDuration: '30', // Default slot duration
      selectedDays: [],
      eventId: '',
    }
  )
  const FormTitles = ['Basic Event Details', 'Event Avalilability Details', 'Confirmation']
  const days = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Saturday', value: 'saturday' },
    { name: 'Sunday', value: 'sunday' },
  ];

 

 
// Function to handle error in input fields
  const validateInputs = () => {
    const { eventName, eventMail, startDate, endDate, selectedDays } = eventFormData;
    const newErrors = {};

    if (!eventName.trim()) {
      newErrors.eventName = 'Event Name is required';
    }

    if (!eventMail.trim()) {
      newErrors.eventMail = 'Event Mail is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Event Start Date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'Event End Date is required';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
    }

    const checkedDayValues = selectedDays.map((day) => day.eventDay);
    console.log(checkedDayValues);
    if (checkedDayValues.length === 0) {
      newErrors.selectedDays = 'Please select at least one day';
      console.log('Selected days',selectedDays);
     
     
    }
    if(checkedDayValues.length >0){
      console.log("coming");
      selectedDays.forEach((day) => {
        const { eventDay, startTime, endTime, intervalEnabled, intervalStartTime, intervalEndTime } = day;
        console.log(day);
        if ((!startTime || startTime==='') && (!endTime===''|| endTime==='')) {
          newErrors.selectedDays = `Please enter valid times for ${eventDay}`;
         
        }
        
        if(intervalEnabled){
          if ((!intervalStartTime || intervalStartTime==='') && (!intervalEndTime || intervalEndTime==='')) {
            newErrors.selectedDays = `Please enter valid break times for ${eventDay}`;
          }
        }
      });
    }
    setErrors(newErrors);
    console.log('eRROS',newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(() => {
    // Render the event data if the initial event available for edit
    if (initialEvent) {
      console.log(initialEvent);
      const { eventName, eventMail, startDate, endDate, appointmentDuration, eventDays, eventId } = initialEvent;

      setEventFormData({
        eventName: eventName,
        eventMail: eventMail,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        appointmentDuration: appointmentDuration,
        selectedDays: setEventDaysDetails(eventDays),
        eventId: eventId,
      });
    }
  }, [initialEvent, currentDate]);

// To handle the eventsdays details
  function setEventDaysDetails(eventDaysArray) {
    console.log(eventDaysArray);
    return eventDaysArray.map((obj) => ({
      ...obj,
      startTime: convertEpochToHHmm(obj.startTime),
      endTime: convertEpochToHHmm(obj.endTime),
      intervalStartTime: convertEpochToHHmm(obj.intervalStartTime),
      intervalEndTime: convertEpochToHHmm(obj.intervalEndTime)
    }));
  }

// Converting the Epoch to HH:mm format
  function convertEpochToHHmm(epochTime) {
    if (!epochTime) return ''; // Handle empty or invalid input
    return moment(epochTime).format('HH:mm');
  }
  const handleDayChange = (dayValue, checked) => {
    if (checked) {
      const newDay = {
        eventDay: dayValue,
        startTime: '',
        endTime: '',
        intervalEnabled: false,
        intervalStartTime: '',
        intervalEndTime: '',
      };
      setEventFormData((prevState) => ({
        ...prevState,
        selectedDays: [...prevState.selectedDays, newDay],
      }));
    } else {
      setEventFormData((prevState) => ({
        ...prevState,
        selectedDays: prevState.selectedDays.filter((day) => day.eventDay !== dayValue),
      }));
    }
  };

  // To handle the time input changes
  const handleTimeChange = (dayValue, field, value) => {
    setEventFormData((prevState) => ({
      ...prevState,
      selectedDays: prevState.selectedDays.map((day) =>
        day.eventDay === dayValue ? { ...day, [field]: value } : day
      ),
    }));
  };

  // To handle the Interval Enable changes
  const handleIntervalEnableChange = (dayValue, checked) => {
    setEventFormData((prevState) => ({
      ...prevState,
      selectedDays: prevState.selectedDays.map((day) =>
        day.eventDay === dayValue ? { ...day, intervalEnabled: checked } : day
      ),
    }));
  };


  // To handle the submit of the events
  const handleSubmit = (e) => {
    e.preventDefault();
    if(validateInputs()){
      try {
        const newEvent = setFormDetails();
        fetch('/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEvent)
        }).then((res) => {
          if (!res.ok) {
            Toast.fire({
              icon: 'error',
              title: 'Something went wrong',
              iconColor: 'error'
            })
            console.log("Server Error")
            throw new Error('Network response was not ok');
          }
          Toast.fire({
            icon: 'success',
            iconColor: 'success',
            title: 'Event Created Successfully',
          })
          handleChanges(newEvent)
          onClose()
        });
  
  
      }
      catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Something went wrong in catch',
          iconColor: 'error'
        })
        console.log('Error:', error);
      }
      console.log(setFormDetails())
    }
    else{
      Toast.fire({
        icon: 'error',
        title: 'Please enter valid details',
        iconColor: 'error'
      })
    }
   
  };

  // To handle edit operations
  const handleEdit = (e) => {
    e.preventDefault();
    let eventUpdatedData = setFormDetails();
    fetch(`/api/event/${eventFormData.eventId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventUpdatedData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let editedData = eventUpdatedData
        editedData.eventId = eventFormData.eventId
        handleChanges(editedData)
        Toast.fire({
          icon: 'success',
          iconColor: 'success',
          title: 'Event Updated Successfully',
        })
        // OnSuccess(eventUpdatedData)
        onClose();
      })
      .catch(error => {
        Toast.fire({
          icon: 'error',
          title: 'Something went wrong',
          iconColor: 'error'
        })
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  // To set the form details to pass data to the server
  const setFormDetails = () => {
    const { eventName, eventMail, startDate, endDate, appointmentDuration, selectedDays, eventId } = eventFormData;
    let eventDays;
    eventDays = selectedDays.map((day) => ({
      eventDay: day.eventDay,
      startTime: moment(day.startTime, 'HH:mm').valueOf(),
      endTime: moment(day.endTime, 'HH:mm').valueOf(),
      intervalEnabled: day.intervalEnabled,
      intervalStartTime: day.intervalStartTime ? moment(day.intervalStartTime, 'HH:mm').valueOf() : '',
      intervalEndTime: day.intervalStartTime ? moment(day.intervalEndTime, 'HH:mm').valueOf() : '',
    }))

    // Create newEvent object for submission
    const newEvent = {
      ownerId: userId,
      eventName,
      eventMail,
      startDate: moment(startDate).valueOf(),
      endDate: moment(endDate).valueOf(),
      appointmentDuration,
      eventDays: eventDays,
    };
    console.log(newEvent);
    return newEvent;

  }


  return (
    // If initial event present form data will be populated
    <div data-model>
      <div className="formContainer">
        <div className="formHeader">
          <h2 className="formHeading">
            {initialEvent ? 'Edit Event' : 'Event Creation'}
          </h2>
          <button className="cancelCreation" onClick={onClose}>
            <BiX />
          </button>
        </div>
        <div className="progressBarContainer">
          <div className="progressbar">
            <div style={{ width: page === 0 ? "33.3%" : page === 1 ? "66.6%" : "100%" }}></div>
          </div>
        </div>

        <div className="formContentContainer">
          <div className="formContentHeader">
            <h3 style={{ fontSize: '18px' }}>{FormTitles[page]}</h3>
            <hr style={{ margin: '10px 0px 0px 0px' }} />
          </div>
          <div className="formContentBody">
            <form className="createAppointment" onSubmit={initialEvent ? handleEdit : handleSubmit}>
              {/* Basic Event Details */}
              <div className="formChild formDetails">
                {page === 0 && <div className="formChild basicDetails">
                  <div className="formGroup ih-input" >
                    {console.log('Event Date')}
                    <input
                      className="ih-form-control"
                      type="text"
                      name="eventName"
                      value={eventFormData.eventName}
                      onChange={(e) => setEventFormData({ ...eventFormData, eventName: e.target.value })}
                      id="eventName"
                      required />
                    <label htmlFor="eventName" className="ih-input-label">Event Name</label>
    
                    {errors.eventName && <div className="error">{errors.eventName}</div>}
                  </div>
                  <div className="formGroup ih-input">
                    <input
                      className="ih-form-control"
                      type="email"
                      onChange={(e) => setEventFormData({ ...eventFormData, eventMail: e.target.value })}
                      name="eventMail"
                      value={eventFormData.eventMail}
                      id="eventMail"
                      required />
                    <label htmlFor="eventMail" className="ih-input-label">Event Mail</label>
                    {/* <BiMailSend className='Eventinput-icon'></BiMailSend> */}
                    {errors.eventMail && <div className="error">{errors.eventMail}</div>}
                  </div>
                  <div className="formGroup ih-input">
                    <input
                      className="ih-form-control dateSelector"
                      type="date"
                      onChange={(e) => setEventFormData({ ...eventFormData, startDate: e.target.value })}
                      name="startDate"
                      id="startDate"
                      value={eventFormData.startDate}
                      min={currentDate}
                      required />
                    <label htmlFor="startDate" className="ih-input-label">Event Start Date</label>

                    {errors.startDate && <div className="error">{errors.startDate}</div>}

                  </div>
                  <div className="formGroup ih-input">
                    <input
                      className="ih-form-control dateSelector"
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={eventFormData.endDate}
                      min={currentDate}
                      required
                      onChange={(e) => setEventFormData({ ...eventFormData, endDate: e.target.value })} />
                    <label htmlFor="endDate" className="ih-input-label">Event End Date</label>
                    {errors.endDate && <div className="error">{errors.endDate}</div>}

                  </div>
                  <div className="ih-input floating-label">
                    <label htmlFor="slotDuration" className="slotDurationLabel">Appointment Duration</label>
                    <select
                      name="slotDuration"
                      id="slotDuration"
                      className="slotDurationInput"
                      required
                      value={eventFormData.appointmentDuration}
                      onChange={(e) => setEventFormData({ ...eventFormData, appointmentDuration: e.target.value })}
                    >
                      <option value="15">15 Mins</option>
                      <option value="30">30 Mins</option>
                      <option value="60">1 hour</option>
                      <option value="90">1 hour 30 mins</option>
                      <option value="120">2 hour</option>
                      <option value="150">2 hour 30 mins</option>
                    </select>
                    <div className="error"></div>
                  </div>
                </div>}

                {/* Event Days Selection */}
                {page === 1 && <div className="formChild slotDetails">
                  <div className="workingDays">
                    <h4 id="eventAvailableDays">
                      <FaCalendarWeek></FaCalendarWeek> Event Days
                    </h4>
                    <p>Choose your events available days {(eventFormData.startDate && eventFormData.endDate) ? `between ${formatDate(eventFormData.startDate)} - ${formatDate(eventFormData.endDate)}` : ''}</p>

                    {errors.selectedDays && <div className="error">{errors.selectedDays}</div>}
                    {days.map((day) => (

                      <div key={day.value} className="dayWiseSetting">

                        <div className="dayTimegroup">
                          <div className="day">
                            <input
                              type="checkbox"
                              name={day.value}
                              value={day.value}
                              className="weekday"
                              defaultChecked={eventFormData.selectedDays.some((d) => d.eventDay === day.value)}
                              onChange={(e) => handleDayChange(day.value, e.target.checked)}
                            />
                            <label htmlFor={day.value}>{day.name}</label>
                          </div>
                          {eventFormData.selectedDays.some((d) => d.eventDay === day.value) && (
                            <div className="time">
                              <input
                                className="startTime"
                                type="time"
                                step="900"
                                value={eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.startTime || ''}
                                onChange={(e) => handleTimeChange(day.value, 'startTime', e.target.value)}
                              />
                              <input
                                className="endTime"
                                type="time"
                                step="900"
                                value={(eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.endTime) || ''}
                                onChange={(e) => handleTimeChange(day.value, 'endTime', e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                        {eventFormData.selectedDays.some((d) => d.eventDay === day.value) && (
                          <div className="breakTimeGroup">
                            <div className="enableBreak">
                              <input
                                type="checkbox"
                                name="break"
                                className={`break ${day.value}`}
                                checked={eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.intervalEnabled}
                                onChange={(e) =>
                                  handleIntervalEnableChange(day.value, e.target.checked)
                                }
                              />
                              <label htmlFor="break">Break</label>
                            </div>
                            {eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.intervalEnabled && (
                              <div className="breakDuration">
                                <input
                                  type="time"
                                  step="900"
                                  name="breakStartTime"
                                  className="breakStartTime"
                                  value={eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.intervalStartTime || ''}

                                  onChange={(e) =>
                                    handleTimeChange(day.value, 'intervalStartTime', e.target.value)
                                  }
                                />

                                <input
                                  type="time"
                                  step="900"
                                  name="breakEndTime"
                                  className="breakEndTime"
                                  value={eventFormData.selectedDays.find((d) => d.eventDay === day.value)?.intervalEndTime || ''}
                                  onChange={(e) =>
                                    handleTimeChange(day.value, 'intervalEndTime', e.target.value)
                                  }

                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>}
                {page === 2 && <div className="formChild confirmationContainer">
                  <div className="enteredeventDetails">
                    <h4 style={{ fontSize: '18px' }}>{eventFormData.eventName}</h4>
                    <p><BiCalendarCheck className='formConfirmationIcon'></BiCalendarCheck><b>Event Duration</b> {formatDate(eventFormData.startDate)} - {formatDate(eventFormData.endDate)}</p>
                    <p><BiHourglass className='formConfirmationIcon'></BiHourglass> <b>Appointment Duration</b> {setSessionDuration(eventFormData.appointmentDuration)}</p>
                    <p> <BiMailSend className='formConfirmationIcon'></BiMailSend> <b>Contact Mail </b> {eventFormData.eventMail}</p>
                    <p><BiLaptop className='formConfirmationIcon'></BiLaptop> <b>Event Avaliable Days</b></p>
                    {eventFormData.selectedDays.length > 0 &&
                      <Table
                        tableType='formscheduleTable'
                        tablecolumns={['Day', 'Start Time', 'End Time', 'Interval Enabled?', 'Break Start Time', 'Break End Time']}
                        tablerows={eventFormData.selectedDays.map(day => ({
                          'Day': day.eventDay,
                          'Start Time': (day.startTime),
                          'End Time': (day.endTime),
                          'Interval Enabled?': day.intervalEnabled ? "Yes" : "No",
                          'Break Start Time': day.intervalEnabled ? (day.intervalStartTime) : '-',
                          'Break End Time': day.intervalEnabled ? (day.intervalEndTime) : '-'
                        }
                        ))}
                      />
                    }

                  </div>
                </div>}

              </div>
              <div className="formContentFooter">
                <button
                  type='button'
                  className='navbtn formBtn'
                  disabled={page === 0}
                  onClick={() => { setPage(currPage => currPage - 1) }}>Prev</button>
                <button
                  type='button'
                  style={{ display: page === FormTitles.length - 1 ? 'none' : 'block' }}
                  className='navbtn formBtn'
                 
                  // disabled = {page === FormTitles.length -1}
                  onClick={() => {
                    setPage(currPage => currPage + 1)
                  }
                  }>Next</button>
                <button className="formBtn"
                 type="submit" 
                 style={{ display: page !== FormTitles.length - 1 ? 'none' : 'block' }}
                 disabled={validateInputs}
                 >
                  {initialEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default EventForm;
