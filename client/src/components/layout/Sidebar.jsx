import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Home, User, Bell } from 'lucide-react';
import { useNotificationStore } from "../../store/useNotificationStore.js";
const Sidebar = () => {
    const { authUser } = useAuthStore();
    const { notifications } = useNotificationStore();
    return (
        <ul className="menu bg-base-100 w-full rounded-box p-2">
            <li>
                <NavLink to="/" end> {/* 'end' prop ensures active class only for exact match */}
                    <Home className="h-5 w-5" />
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to={`/profile/${authUser?.username}`}>
                    <User className="h-5 w-5" />
                    Profile
                </NavLink>
            </li>

            {/* Placeholder Links */}
            <li>
                <NavLink to="/notifications">
                <div className="indicator">

                
                    {notifications.length > 0 && (
                        <span className="indicator-item badge badge-primary badge-xs"></span>
                    )}
                    <Bell className="h-5 w-5" />
                    Notifications
                </div>
                </NavLink>
            </li>

        </ul>
    );
};

export default Sidebar;