import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import { Home, User, Bell, MessageSquare } from 'lucide-react';

const Sidebar = () => {
    const { authUser } = useAuthStore();

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
                    <Bell className="h-5 w-5" />
                    Notifications
                </NavLink>
            </li>
            <li>
                <NavLink to="/messages">
                    <MessageSquare className="h-5 w-5" />
                    Messages
                </NavLink>
            </li>
        </ul>
    );
};

export default Sidebar;