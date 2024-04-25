//Package and hooks
import { setSessionDuration, formatDate } from "../utils/dateFormatter.js";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
// Images and utlits
import { BiCalendarCheck, BiHourglass, BiLaptop, BiMailSend } from 'react-icons/bi'
import { FaArrowLeft, FaCalendarWeek } from "react-icons/fa";
import eventDetails from '../assets/eventDetails.svg'
import Table from "./Table.jsx";



function EventDetails(props) {
    let navigate = useNavigate()
    const { eventInfo, setAppointmentView, userType , setToView } = props


    function backToDashboard(){
        if(userType === 'eventsOwner'){
            navigate('/owner/dashboard')
        }
        else{
            navigate('/user/events')
        }
    }
    return (
        <div className="eventDetailsContainer">
            <div className="eventcontainerHeader">
                <div className="eventDetailsHeader">
                <FaArrowLeft onClick={backToDashboard} style={{cursor:"pointer"}}></FaArrowLeft>
                <h2>{eventInfo.eventName}</h2>
                </div>
              
                {/* <div className="viewSwapContainer"></div> */}
            </div>

            <div className="eventcontainerBody">
                <div className="eventDetailsImg">
                    <img src={eventDetails} alt="" />
                </div>
                <div className="eventDetails">
                    <div className="eventDetailsTitle"><h3>Event Details</h3>
                        <button onClick={() => setAppointmentView(true)}>{userType === 'attendee' ? 'Book an Appointment' : 'View Appoiments'}</button>
                    </div>
                    <p><FaCalendarWeek></FaCalendarWeek> <b> Event Name </b>{eventInfo.eventName}</p>
                    <p><BiCalendarCheck></BiCalendarCheck><b>Event Duration</b> {formatDate(eventInfo.startDate)} - {formatDate(eventInfo.endDate)}</p>
                    <p><BiHourglass></BiHourglass> <b>Appointment Duration</b> {setSessionDuration(eventInfo.appointmentDuration)}</p>
                    <p> <BiMailSend></BiMailSend> <b>Contact Mail </b> {eventInfo.eventMail}</p>
                    <p><BiLaptop></BiLaptop> <b>Event Schedule</b></p>
                    <Table
                        tableType='scheduleTable'
                        tablecolumns={['Day', 'Start Time', 'End Time', 'Interval Enabled?', 'Break Start Time', 'Break End Time']}
                        tablerows={eventInfo.eventDays.map(day => ({
                            'Day': day.eventDay,
                            'Start Time': moment(day.startTime).format('HH:mm'),
                            'End Time': moment(day.endTime).format('HH:mm'),
                            'Interval Enabled?': day.intervalEnabled ? "Yes" : "No",
                            'Break Start Time': day.intervalEnabled ? moment(day.intervalStartTime).format('HH:mm') : '-',
                            'Break End Time': day.intervalEnabled ? moment(day.intervalEndTime).format('HH:mm') : '-'
                        }
                        ))}
                    />
                </div>
            </div>

        </div>
    );
}

export default EventDetails;
