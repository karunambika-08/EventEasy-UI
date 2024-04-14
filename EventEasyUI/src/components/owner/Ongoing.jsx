// Packages and hooks
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import { formatDate, setSessionDuration } from "../../utils/dateFormatter.js"
// Components
import EventForm from "./EventForm.jsx";
import Loader from '../Loader';
// Styles
import styles from '../../styles/owner/Ongoing.module.css'
// Images
import noEventsSVG from '../../assets/noEventsAvailable.svg';
import deleteIcon from '../../assets/delete.svg';
import { BiCalendarCheck, BiSolidHourglassBottom, BiEdit, BiTrash } from 'react-icons/bi'

function Ongoing(props) {
    let navigate = useNavigate()
    const{userId} = props
    console.log(userId)
    let [onGoingEvents, setOngoingEvents] = useState([])
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        setLoading(false);
    }, [onGoingEvents]);

    useEffect(() => {
        if (userId) {
            fetchEvents();
        }
    }, [userId])

    const fetchEvents = async () => {
        try {
            fetch(`http://localhost:3000/eventsOwner/${userId}/${"ongoing"}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        let jsonData = await response.json();
                        return jsonData;
                    }
                })
                .then(async (response) => {
                    console.log("Response", response);
                    setOngoingEvents(response)
                    console.log("Events", onGoingEvents);
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


    function handleClick(eventId){

        navigate(`/owner/dashboard/event/appointments/${eventId}`)
    }
    if (loading) {
        return <Loader />
    }

    Ongoing.prototype = {
        userId: PropTypes.string
    }

    async function handleDelete(eventId) {
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
                    const response = await fetch(`http://localhost:3000/event/${eventId}/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const jsonData = await response.json();
                        setOngoingEvents(onGoingEvents.filter(eventInfo => eventInfo.eventId !== eventId));
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

    function handleSuccess(event){
        setOngoingEvents(event)
    }

     function handleEdit(event){
        setEditingEvent(event);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false); 
      };
    
      const toggleModal = (event) => {
        handleEdit(event)
        setIsModalOpen(!isModalOpen);
    
      };

      const toggleNewModal =()=>{
        setIsModalOpen(!isModalOpen);
      }

    return (
        
        <div className={styles.contentLeft}>
            <div className={styles.eventsContainer} id="eventsContainer">
                {onGoingEvents.length > 0 ?
                    onGoingEvents.map(event => (
                        <div className={styles.eventCard} key={event.eventId}>
                            <h3>{event.eventName}</h3>
                            <p className={styles.eventDetails}><BiCalendarCheck className={styles.eventCardIcon} /> <span> {formatDate(event.startDate)} - {formatDate(event.endDate)}</span></p>
                            <p className={styles.eventDetails}><BiSolidHourglassBottom className={styles.eventCardIcon} /> Duration: {setSessionDuration(event.appointmentDuration)}</p>
                            <div className={styles.manipulateCard}>
                                <button id={event.eventId} className={styles.viewEvent} onClick={()=> handleClick(event.eventId)}>Appointments</button>
                                <button id={event.eventId} className={styles.editEvent} onClick={() => toggleModal(event)} ><BiEdit></BiEdit></button>
                                <button className={styles.deleteEvent} onClick={() => handleDelete(event.eventId)}><BiTrash></BiTrash></button>
                            </div>
                        </div>

                    )

                    ) : (
                        <div className={styles.noEventsContainer}>
                            <img src={noEventsSVG} alt="No ongoing events" />
                            <p><h4>No Events Created , Click <a onClick={()=> toggleNewModal()} style={{color: '#0064E0' , cursor: "pointer"}}>Create Events</a> to create your events</h4></p>
                        </div>
                    )}
                    
                    {(isModalOpen && editingEvent) && (
                         <div className={styles.overlayContainer} style={{display : isModalOpen? "flex" : "none"}} onClick={handleCloseModal}>
                         <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
                         <EventForm
                        userId={userId} 
                        onClose={handleCloseModal} 
                        initialEvent={editingEvent}
                        OnSuccess = {handleSuccess}
                    />
                         </div>
                       </div>
                )}

                {(isModalOpen ) && (
                         <div className={styles.overlayContainer} style={{display : isModalOpen? "flex" : "none"}} onClick={handleCloseModal}>
                         <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
                         <EventForm
                        userId={userId} 
                        onClose={handleCloseModal} 
                        OnSuccess = {handleSuccess}
                    />
                         </div>
                       </div>
                )}
            </div>
        </div>

    )
}

export default Ongoing