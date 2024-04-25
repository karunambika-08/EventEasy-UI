import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import logoutImage from '../assets/logout.svg';
import { FaBars, FaCalendarCheck, FaCalendarDay, FaSignOutAlt, FaTh } from 'react-icons/fa';

import Swal from 'sweetalert2'; // Alter triggering Package (toast and Confirmation Popup)

/**
 * @param {*} props type of user logged in(owner , attendee)
 * @returns SideNavigation Element
 */
function SideBar(props) {
    const { type, toggleSideNavbar, isSideNavbarOpen } = props;

    // Function to handle logout action
    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure to logout?',
            imageUrl: logoutImage,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Are you sure you want to logout?',
            showCancelButton: true,
            confirmButtonColor: '#0064E0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
        }).then((result) => {
            if (result.isConfirmed) {
                // User confirmed logout
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userDetails');
                window.location.href = '/'; // Redirect to the logout URL
            }
        });
    };

    // Define menu items for owner 
    const OwnerMenuItem = [
        {
            path: '/owner/dashboard',
            name: 'Dashboard',
            icon: <FaTh />,

        },
        {
            path: '/',
            name: 'Logout',
            icon: <FaSignOutAlt />,
            onclick: handleLogout,

        },
    ];
    // Define menu items for attendee
    const AttendeeMenuItem = [
        {
            path: '/user/appointments',
            name: 'Appointments',
            icon: <FaCalendarCheck />,
        },
        {
            path: '/user/events',
            name: 'Events',
            icon: <FaCalendarDay />,
        },
        {
            path: '/',
            name: 'Logout',
            icon: <FaSignOutAlt />,
            onClick: handleLogout, // Assign handleLogout directly to onClick
        },
    ];


    return (
        <div className="sidebarcontainer">
            <div style={{ width: isSideNavbarOpen ? '250px' : '45px' }} className="sidebar">
                <div className="sidbarTopSection">
                    <h1 className="sidebarlogoText" style={{ display: isSideNavbarOpen ? 'block' : 'none' }}>
                        EventEasy
                    </h1>
                    <div className="sidebar_Navbars" style={{ marginLeft: isSideNavbarOpen ? '50px' : '0px' }}>
                        <FaBars onClick={toggleSideNavbar} />
                    </div>
                </div>
                {/* Render menu items based on user type */}
                {(type === 'owner' ? OwnerMenuItem : AttendeeMenuItem).map((item, index) => (
                    <NavLink
                        key={index}
                        to={`${item.path}`}
                        className={`sidebarLink`}
                        onClick={item.onclick} // Assign onClick handler directly
                    >
                        <div className="sidebaricon">{item.icon}</div>
                        <div style={{ display: isSideNavbarOpen ? 'block' : 'none' }} className="sidebarLinkText">
                            {item.name}
                        </div>
                    </NavLink>
                ))
                }
            </div>
        </div>
    );
}

export default SideBar;
