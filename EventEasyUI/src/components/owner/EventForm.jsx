import { useState , useEffect } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';
import moment from 'moment';
import '../../App.css';
import { Toast } from  '../../utils/Notify'
function EventForm(props ) {
  const { userId , onClose , initialEvent , OnSuccess} = props;
  
  const currentDate = moment().format('YYYY-MM-DD');
  let defaultDate = moment().format('DD-MM-YYYY')
  const [eventName, setEventName] = useState('');
  const [eventMail, setEventMail] = useState('');
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState('');
  const [appointmentDuration, setAppointmentDuration] = useState('30'); // Default slot duration
  const [selectedDays, setSelectedDays] = useState([]);
  const [eventId , setEventId] = useState('')

  const days = [
    { name: 'Monday', value: 'monday' },
    { name: 'Tuesday', value: 'tuesday' },
    { name: 'Wednesday', value: 'wednesday' },
    { name: 'Thursday', value: 'thursday' },
    { name: 'Friday', value: 'friday' },
    { name: 'Saturday', value: 'saturday' },
    { name: 'Sunday', value: 'sunday' },
  ];



  
  useEffect(() => {

    if (initialEvent) {
      console.log('Hi', initialEvent)
      setEventName(initialEvent.eventName || '');
      setEventMail(initialEvent.eventMail || '');
      setStartDate(moment(initialEvent.startDate).format('YYYY-MM-DD') || currentDate);
      setEndDate( moment(initialEvent.endDate).format('YYYY-MM-DD') || '');
      setAppointmentDuration(initialEvent.appointmentDuration || '30');
      setSelectedDays(setEventDaysDetails(initialEvent.eventDays) || []);
      setEventId(initialEvent.eventId || '')
    }
  }, [initialEvent,currentDate]);


  function setEventDaysDetails(eventDaysArray){
    return eventDaysArray.map((obj) => ({
      ...obj,
      startTime: convertEpochToHHmm(obj.startTime),
      endTime: convertEpochToHHmm(obj.endTime),
      intervalStartTime: convertEpochToHHmm(obj.intervalStartTime),
      intervalEndTime: convertEpochToHHmm(obj.intervalEndTime)
    }));
  }

  function convertEpochToHHmm(epochTime) {
    if (!epochTime) return ''; // Handle empty or invalid input
    return moment(epochTime).format('HH:mm');
  }
  const handleDayChange = (dayValue, checked) => {
    console.log("Checked" , checked);
    if (checked) {
      const newDay = {
        eventDay: dayValue,
        startTime: '',
        endTime: '',
        intervalEnabled: false,
        intervalStartTime: '',
        intervalEndTime: '',
      };
  
      setSelectedDays((prevDays) => [...prevDays, newDay]);
  
    } else {
      setSelectedDays((prevDays) => prevDays.filter((day) => day.eventDay !== dayValue));
    }
  };

  const handleTimeChange = (dayValue, field, value) => {
   console.log("New value" , value);
  
    setSelectedDays((prevDays) =>
      prevDays.map((day) => (day.eventDay === dayValue ? { ...day, [field]: value } : day))
    );
  };

  const handleIntervalEnableChange = (dayValue, checked) => {
    setSelectedDays((prevDays) =>
      prevDays.map((day) => (day.eventDay === dayValue ? { ...day, intervalEnabled: checked } : day))
    );
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setUpCreateFormSubmission()
    // Filter out days with no start time selected
    async function setUpCreateFormSubmission() {
      try {
        console.log("Hi------");
        const newEvent = setFormDetails() ;
        const response = await fetch('http://localhost:3000/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newEvent)
        });
        const data = await response.json();
        console.log("Data->", data);
        if (response.ok) {
          await Toast.fire({
            icon: 'success',
            iconColor : 'success',
            title: 'Event Created Successfully',
          })
          setTimeout(() => {
          
            
          
            onClose()
          }, 2000);
          
          // Redirect to owner dashboard after a delay
          // setTimeout(() => {
           
          // }, 2000);
        } else {
          await Toast.fire({
            icon : 'error',
            title : 'Something went wrong',
            iconColor : 'error'
          })
          console.log("Server Error")
        }
      } catch (error) {
        await Toast.fire({
          icon : 'error',
          title : 'Something went wrong',
          iconColor : 'error'
        })
        console.log('Error:', error);
      }
    }

    console.log(setFormDetails())
    // const filteredDays = selectedDays.filter((day) => day.startTime !== '' && day.endTime !== '');
    // console.log('Filtered Days:', filteredDays);
   
    
  };

  const handleEdit = (e) =>{
    e.preventDefault();
    let eventUpdatedData = setFormDetails();
      fetch(`http://localhost:3000/event/${eventId}`,
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
          setTimeout(() => {
            Toast.fire({
              icon: 'success',
              iconColor: 'success',
              title: 'Event Updated Successfully',
            })
         
            // OnSuccess(eventUpdatedData)
            onClose()
          }, 2000);
          return response.json();
        })
        .catch(error => {
          Toast.fire({
            icon : 'error',
            title : 'Something went wrong',
            iconColor : 'error'
          })
          console.error('There was a problem with the fetch operation:', error);
        });
  }
  console.log("selected days:", selectedDays)
  const setFormDetails = () =>{
    
    const filterSelectedDays = selectedDays.filter((day) => day.startTime !== '' && day.endTime !== '');
    let eventDays;
  
     eventDays = filterSelectedDays.map((day)=>({
      eventDay: day.eventDay,
      startTime: moment(day.startTime, 'HH:mm').valueOf(),
      endTime: moment(day.endTime, 'HH:mm').valueOf(),
      intervalEnabled: day.intervalEnabled,
      intervalStartTime: day.intervalStartTime ? moment(day.intervalStartTime, 'HH:mm').valueOf() : '',
      intervalEndTime: day.intervalStartTime ? moment(day.intervalEndTime, 'HH:mm').valueOf() : '',
    }))
  
 
    
    const formData ={
      ownerId: userId
      , eventName: eventName
      , eventMail: eventMail
      , startDate: moment(startDate).valueOf()
      , endDate: moment(endDate).valueOf()
      , appointmentDuration: appointmentDuration
      , eventDays: eventDays
    } 


    return formData;
  }

 
  return (
    <div data-model>
      <div className="formContainer">
        <div className="formHeader">
          <h2 className="formHeading">
            {console.log("Initial Event",initialEvent)}
            {initialEvent ? 'Edit Event' : 'Event Creation'}
          </h2>
          <button className="cancelCreation" onClick={onClose}>
            <BiX />
          </button>
        </div>
        <form className="createAppointment"  onSubmit={initialEvent ? handleEdit : handleSubmit }>
          {/* Basic Event Details */}
          <div className="formChild formDetails">
          <div className="formChild basicDetails">
              <div className="formGroup ih-input" >
                <label htmlFor="eventName" className="ih-input-label">Event Name</label>
                <input
                 className="ih-form-control"
                  type="text" 
                  name="eventName" 
                  value={eventName}
                  onChange={(e)=>setEventName(e.target.value)}
                  id="eventName"  />
                <div className="error"></div>
              </div>
              <div className="formGroup ih-input">
                <label htmlFor="eventMail" className="ih-input-label">Event Mail</label>
                <input 
                className="ih-form-control"
                 type="email" 
                 onChange={(e)=>setEventMail(e.target.value)}
                 name="eventMail"
                 value={eventMail}
                  id="eventMail"  />
                <div className="error"></div>
              </div>
              <div className="formGroup ih-input">
                <label htmlFor="startDate" className="ih-input-label">Event Start Date</label>
                <input 
                className="ih-form-control dateSelector"
                 type="date" 
                 onChange={(e)=>setStartDate(e.target.value)}
                 name="startDate"
                  id="startDate"
                  value={startDate}
                  min={currentDate}
                  
                  placeholder="Event Start Date" />
                <div className="error"></div>
              </div>
              <div className="formGroup ih-input">
                <label htmlFor="endDate" className="ih-input-label">Event End Date</label>
                <input 
                className="ih-form-control dateSelector" 
                type="date"
                 name="endDate" 
                 id="endDate" 
                 value={endDate}
                 min={currentDate || startDate}
                 onChange={(e)=>setEndDate(e.target.value)}  />
                <div className="error"></div>
              </div>
              <div className="formGroup ih-input floating-label">
                <label htmlFor="slotDuration" className="ih-input-label">Appointment Duration</label>
                <select name="slotDurationn" id="slotDuration" className="ih-form-control" value={appointmentDuration} onChange={(e)=>setAppointmentDuration(e.target.value)}>
                  <option value="15">15 Mins</option>
                  <option value="30">30 Mins</option>
                  <option value="60">1 hour</option>
                  <option value="90">1 hour 30 mins</option>
                  <option value="120">2 hour</option>
                  <option value="150">2 hour 30 mins</option>
                </select>
                <div className="error"></div>
              </div>
            </div>
        

                   {/* Event Days Selection */}
            <div className="formChild slotDetails">
            <div className="workingDays">
              <h6 id="eventAvailableDays">
                <i className="bi bi-calendar3"></i> Event Days
              </h6>
              <p>Choose your events available days</p>
              <div className="error"></div>
              {days.map((day) => (
                 
                <div key={day.value} className="dayWiseSetting">
                
                  <div className="dayTimegroup">
                    <div className="day">
                      <input
                        type="checkbox"
                        name={day.value}
                        value={day.value}
                        className="weekday"
                        // checked = {selectedDays.some((d) => d.eventDay === day.value)}
                        defaultChecked={selectedDays.some((d) => d.eventDay === day.value)}
                        onChange={(e) => handleDayChange(day.value, e.target.checked)}
                      />
                     {console.log( selectedDays.some((d) => d.eventDay === day.value))}
                      <label htmlFor={day.value}>{day.name}</label>
                    </div>
                    {selectedDays.some((d) => d.eventDay === day.value) && (
                      <div className="time">
                        <input
                          className="startTime"
                          type="time"
                          step="900"
                          value={selectedDays.find((d) => d.eventDay === day.value)?.startTime || ''}
                          onChange={(e) => handleTimeChange(day.value, 'startTime', e.target.value)}
                        />
                        {console.log("Kavvi",selectedDays.find((d) => d.eventDay === day.value)?.startTime )||''}
                        <input
                          className="endTime"
                          type="time"
                          step="900"
                          value={(selectedDays.find((d) => d.eventDay === day.value)?.endTime)||''}
                          onChange={(e) => handleTimeChange(day.value, 'endTime', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  {
                  selectedDays.some((d) => d.eventDay === day.value) && (
                   
                    <div className="breakTimeGroup">
                       { console.log("Hi",selectedDays)}
                      <div className="enableBreak">
                        <input
                          type="checkbox"
                          name="break"
                          className={`break ${day.value}`}
                          checked={selectedDays.find((d) => d.eventDay === day.value)?.intervalEnabled}
                          onChange={(e) =>
                            handleIntervalEnableChange(day.value, e.target.checked)
                          }
                        />
                        <label htmlFor="break">Break</label>
                      </div>
                      {selectedDays.find((d) => d.eventDay === day.value)?.intervalEnabled && (
                        <div className="breakDuration">
                          <input
                            type="time"
                            step="900"
                            name="breakStartTime"
                            className="breakStartTime"
                            value={selectedDays.find((d) => d.eventDay === day.value)?.intervalStartTime || ''}

                            onChange={(e) =>
                              handleTimeChange(day.value, 'intervalStartTime', e.target.value)
                            }
                          />
                          { 
                          console.log("Break Start Time",selectedDays.find((d) => d.eventDay === day.value)?.intervalStartTime )
                          // selectedDays.find((d) => d.eventDay === day.value))
                          // selectedDays.find((d) => d.eventDay === day.value)?.intervalEndTime
                          }
                          <input
                            type="time"
                            step="900"
                            name="breakEndTime"
                            className="breakEndTime"
                            value={ selectedDays.find((d) => d.eventDay === day.value)?.intervalEndTime || ''}
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
          </div>

          {/* Submit Button */}
          <div className="formChild formBtnContainer">
            <button className="formBtn" type="submit">
              {initialEvent ?  'Update' : 'Create'} 
            </button>
          </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
