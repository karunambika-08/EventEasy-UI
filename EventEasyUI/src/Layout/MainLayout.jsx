import { useState } from 'react';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
function MainLayout(props) {
    const { children, type, username } = props;
    const [isSideNavbarOpen, setIsSideNavOpen] = useState(false);
    function toggleSideNavbar(){
        setIsSideNavOpen(!isSideNavbarOpen)
    }
    return (
        <div className='mainLayoutContainer'>
       <SideBar type={type} toggleSideNavbar={toggleSideNavbar} isSideNavbarOpen={isSideNavbarOpen}>  </SideBar>
        <main>    
        <Header username={username} isSideNavbarOpen={isSideNavbarOpen} />
        {children}
       </main>
      
       </div>
    );
}

export default MainLayout;
