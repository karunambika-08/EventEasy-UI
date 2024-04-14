import { useEffect, useState } from 'react';
import { FaCalendarCheck, FaCalendarMinus } from 'react-icons/fa'
import styles from '../../styles/owner/CreatedEvents.module.css'
import Ongoing from './Ongoing';
import PastEvents from './PastEvents';

function CreatedEvents(props) {
    const { userId} = props
   
    console.log(userId,"Created");
    const [tab, setTab] = useState('onGoing');
  // useHistory hook for navigation
  
    function openBooked() {
        setTab('onGoing');
    }

    function openCompleted() {
        setTab('completed');
    }
  
   
    return (
        
             <div className={styles.displayCreatedEvent}>
                
             <div className={styles.tabs}>
                 <div className={styles.btnBox}>
                     {/* <!-- <button><i className="bi bi-calendar2-check"></i> Confirmed</button> --> */}
                     <button id="btn1" 
                         className={tab === 'onGoing' ? styles.activeTab : ''}
                         onClick={openBooked}> <FaCalendarCheck className='tabIcon' style={{marginRight: "10px"}}></FaCalendarCheck>On Going</button>
                     <button id="btn2"
                         className={tab === 'completed' ? styles.activeTab : ''}
                         onClick={openCompleted}><FaCalendarMinus className='tabIcon'  style={{marginRight: "10px"}} ></FaCalendarMinus>Completed</button>
                     {/* <!-- <button>Denied</button> --> */}
                 </div>
                 <div id="content1" className={`${styles.content} ${tab ==='onGoing' ? styles.displayTab : styles.hideTab }`}>
                        <Ongoing userId={userId} />
                 </div>
                 <div id="content2" className={`${styles.content} ${tab ==='completed' ? styles.displayTab : styles.hideTab }`}>
                 <PastEvents  userId ={userId}></PastEvents>
                 </div>

             </div>
         </div>
        
           

           
    )
}

export default CreatedEvents