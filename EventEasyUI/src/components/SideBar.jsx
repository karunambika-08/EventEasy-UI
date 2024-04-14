import { useState } from 'react';
import {
    FaBars,
    FaCalendarCheck,
    FaCalendarDay,
    FaSignOutAlt,
    FaTh,
    FaUserAlt,
} from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Header from './Header';

function SideBar(props) {
  const {children , type , username} = props
  const[isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)
  const OwnerMenuItem = [
    {
      path : '/owner/dashboard',
      name : 'Dashboard',
      icon: <FaTh></FaTh>,
    }
    ,{
      path : '/',
      name : 'Logout',
      icon : <FaSignOutAlt></FaSignOutAlt>
    }
  ]

  const userMenuItem = [
   
      {
        path : '/user/appointments',
        name : 'Appointments',
        icon: <FaCalendarCheck></FaCalendarCheck>,
      },
      {
        path : '/user/events',
        name : 'Events',
        icon: <FaCalendarDay></FaCalendarDay>,
      }
      ,{
        path : '/',
        name : 'Logout',
        icon : <FaSignOutAlt></FaSignOutAlt>
      }
  ]
  return (
    <div className='sidebarcontainer'>
      
        <div style={{width : isOpen? "250px" : "45px"}} className="ownerSidebar">
          <div className="top_section">
            <h1 className="logoText"  style={{display : isOpen? "block" : "none"}}>EventEasy</h1>
            <div className="bars"  style={{marginLeft : isOpen? "50px" : "0px"}}>
              <FaBars onClick={toggle}></FaBars>
            </div>
          </div>
          {type === "owner" ?( 
            OwnerMenuItem.map((item , index)=>(
              <NavLink to={`${item.path}`} key={index} className={`link ${type}` } >
                <div className="icon">{item.icon}</div>
                <div style={{display : isOpen? "block" : "none"}} className="link_text">{item.name}</div>
              </NavLink> 
            ))
          )
        :( 
          userMenuItem.map((item , index)=>(
            
            <NavLink to={`${item.path}`} key={index} className="link" >
              <div className="icon">{item.icon}</div>
              <div style={{display : isOpen? "block" : "none"}} className="link_text">{item.name}</div>
            </NavLink> 
          ))
        )}
        </div>
        <main>
          <Header username={username}  isOpen={isOpen}></Header>
          {children}
        </main>
    </div>
  );
};

export default SideBar