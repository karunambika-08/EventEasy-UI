// import {FaArrowCircleLeft } from 'react-icons/fa'
import styles from '../styles/Header.module.css'
import { useNavigate } from 'react-router-dom';
function Header(props) {
  const {username ,isOpen ,action} = props
  console.log("Username", username);
    // function logoutUser() {
    //     let logoutUser = document.getElementById('logoutbtn');
    //     logoutUser.addEventListener('click', () => {
    //         localStorage.removeItem("currentUser");
    //         window.location.href = "../../html/main/signIn.html";
    //     })
    // }
    const navigate = useNavigate()
  
    function logout(){
      navigate('/')
    }
  return (
  
         <div className={"navbarContainer"}>
            <nav className={"navigation"}>
              <div className={"logoContainer"}>
                <h1 className={"logo"}>{!isOpen ? "EventEasy" : ""}</h1>
              </div>
              <div className={"menulist"}> 
                <div className={"userdropdown"}>
                  <div   className={`${"menulistItems"} ${"userProfile"}`} style={action === 'nouserName' ? {display: 'none' } : {display:'flex'}}>
                    <div className= {"menuLink"} id="userProfileName">{username}</div>
                  </div>

                </div>
                <div className="dropdownContent">
                  {/* <button   className="dropdownitems"  id="logoutbtn" onClick={logout} style={{background:"none" , border:"1px soild #0064E0"}}> Logout </button> */}
            </div>
              </div>
            </nav>
          </div>
    
    
  )
}

export default Header