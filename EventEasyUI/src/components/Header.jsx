// Packages and Hooks
import { FaUserAlt } from 'react-icons/fa';
/**
 * @param {*} props To handle Sidbar opening and closing
 * @returns 
 */
function Header(props) {
  const { username, isSideNavbarOpen, action } = props

  return (

    <div className={"mainHeaderContainer"}>
      <div className={"headerContent"}>
        <div className={"logoContainer"}>
          {/* Display logo in header only if the events open */}
          <h1 className={"headerLogo"}>{!isSideNavbarOpen ? "EventEasy" : ""}</h1>
        </div>
        <div className={`${"currentUsernameContainer"}`} style={action === 'nouserName' ? { display: 'none' } : { display: 'flex' }}>
          <div className={"currentUserName"} ><FaUserAlt className='headerIcon'></FaUserAlt> <p> {username}</p></div>
        </div>
      </div>
    </div>
  )
}

export default Header