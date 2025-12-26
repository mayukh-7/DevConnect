import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useSearchStore } from "../../store/useSearchStore";
import { useNotificationStore } from '../../store/useNotificationStore.js';
import { Bell, User, LogOut, Search, X, ArrowLeft } from 'lucide-react';
import SearchResultItem from "./SearchResultItem";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const { notifications } = useNotificationStore();
    const { searchUsers, searchResults, clearSearch } = useSearchStore();

    const [query, setQuery] = useState("");
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        searchUsers(val);
    };

    const handleClear = () => {
        setQuery("");
        clearSearch();
        setIsMobileSearchVisible(false);
    };

    return (
        <div className="navbar fixed top-0 left-0 right-0 z-50 h-16 px-4 sm:px-6 bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 transition-all duration-300">
            
            {/* --- MOBILE SEARCH VIEW (Only shows when search icon is clicked on small screens) --- */}
            {isMobileSearchVisible ? (
                <div className="flex items-center w-full gap-2 px-2 animate-in fade-in duration-200">
                    <button 
                        onClick={() => setIsMobileSearchVisible(false)} 
                        className="btn btn-ghost btn-circle btn-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative flex-1">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search users..."
                            className="input input-bordered w-full h-10 pr-10 rounded-full bg-base-200 border-transparent focus:border-primary focus:bg-base-100 transition-all"
                            value={query}
                            onChange={handleSearch}
                        />
                        {query && (
                            <button onClick={handleClear} className="absolute right-3 top-2.5">
                                <X className="h-4 w-4 text-base-content/50" />
                            </button>
                        )}
                        {/* Mobile Results Dropdown */}
                        {searchResults.length > 0 && (
                            <ul className="absolute z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-full mt-2 border border-base-300 max-h-60 overflow-y-auto">
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
            ) : (
                /* --- STANDARD NAVBAR VIEW --- */
                <>
                    {/* 1. Navbar Start (Logo) */}
                    <div className="navbar-start">
                        <Link to="/" className="btn btn-ghost text-lg sm:text-xl font-bold p-1 sm:p-2">
                            DevConnect
                        </Link>
                    </div>

                    {/* 2. Navbar Center (Desktop Search - Hidden on Mobile) */}
                    <div className="navbar-center hidden md:block relative">
                        <div className="dropdown w-64 lg:w-80">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="input input-bordered w-full pl-10 h-10 rounded-full bg-base-200 border-transparent focus:border-primary focus:bg-base-100 transition-all"
                                    value={query}
                                    onChange={handleSearch}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-base-content/50" />
                                {query && (
                                    <button onClick={handleClear} className="absolute right-3 top-2.5">
                                        <X className="h-4 w-4 text-base-content/50" />
                                    </button>
                                )}
                            </div>

                            {/* Desktop Results Dropdown */}
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

                    {/* 3. Navbar End (Icons) */}
                    <div className="navbar-end gap-1">
                        
                        {/* Mobile Search Trigger Button (Only visible on Mobile) */}
                        <button 
                            className="btn btn-ghost btn-circle md:hidden"
                            onClick={() => setIsMobileSearchVisible(true)}
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Notifications */}
                        <NavLink to="/notifications" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                {notifications.length > 0 && (
                                    <span className="indicator-item badge badge-primary badge-xs"></span>
                                )}
                                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                        </NavLink>

                        {/* Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-8 sm:w-10 rounded-full border">
                                    <img
                                        alt="Profile"
                                        src={authUser?.ProfilePic || `https://ui-avatars.com/api/?name=${authUser?.username}&background=random`}
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200"
                            >
                                <li className="font-medium p-2 border-b border-base-200">
                                    <span className="text-xs text-base-content/60">Signed in as</span>
                                    <span className="font-bold truncate">{authUser?.username}</span>
                                </li>
                                <li>
                                    <Link to={`/profile/${authUser?.username}`}>
                                        <User className="h-4 w-4" /> Profile
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-error">
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;