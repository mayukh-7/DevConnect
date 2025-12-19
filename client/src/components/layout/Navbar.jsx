import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Bell, Home, User, LogOut } from 'lucide-react';
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchStore } from "../../store/useSearchStore";
import SearchResultItem from "./SearchResultItem";
import { useNotificationStore } from '../../store/useNotificationStore.js';
const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const [query, setQuery] = useState("");
    const { searchUsers, searchResults, clearSearch, isSearching } = useSearchStore();

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        searchUsers(val); // Real-time search
    };

    const handleClear = () => {
        setQuery("");
        clearSearch();
    };
    const { notifications } = useNotificationStore();
    return (
        // Added 'shadow-md' for a subtle lift
        <div className="navbar bg-base-100 fixed top-0 left-0 right-0 z-10 shadow-md">

            {/* --- 1. Navbar Start (Logo) --- */}
            <div className="navbar-start">
                <Link to="/" className="btn btn-ghost text-xl font-bold">
                    DevConnect
                </Link>
            </div>

            {/* --- 2. Navbar Center (Search) --- */}
            <div className="navbar-center  md:block relative">
                <div className="dropdown w-80">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input input-bordered w-full pl-10 pr-10"
                            value={query}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/50" />
                        {query && (
                            <button onClick={handleClear} className="absolute right-3 top-3">
                                <X className="h-5 w-5 text-base-content/50 hover:text-error" />
                            </button>
                        )}
                    </div>

                    {/* Results Dropdown */}
                    {searchResults.length > 0 && (
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-2 border border-base-300">
                            {searchResults.map((user) => (
                                <SearchResultItem
                                    key={user._id}
                                    user={user}
                                    onUserClick={handleClear}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* --- 3. Navbar End (Icons & Profile) --- */}
            <div className="navbar-end">
                {/* Theme Toggle Placeholder */}
                {/* <ThemeToggle /> */}

                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        {/* Only show badge if notifications exist */}
                        {notifications.length > 0 && (
                            <span className="indicator-item badge badge-primary badge-xs"></span>
                        )}
                        <NavLink to="/notifications">
                            <Bell className="h-6 w-6" />
                        </NavLink>
                    </div>
                </button>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Profile"
                                src={authUser?.ProfilePic || `https://ui-avatars.com/api/?name=${authUser?.username}&background=random`}
                            />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li className="font-medium p-2">
                            Signed in as <br />
                            <span className="font-bold">{authUser?.username}</span>
                        </li>
                        <li>
                            <Link to={`/profile/${authUser?.username}`}>
                                <User className="h-4 w-4" />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <a onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;