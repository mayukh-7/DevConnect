import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Search, Bell, Home, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login"); 
    };

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
            <div className="navbar-center  md:block">
                <div className="form-control">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            // Added w-80 for a wider search bar
                            className="input input-bordered w-80" 
                        />
                        <button className="btn btn-ghost btn-circle absolute top-0 right-0">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 3. Navbar End (Icons & Profile) --- */}
            <div className="navbar-end">
                {/* Theme Toggle Placeholder */}
                {/* <ThemeToggle /> */}

                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <Bell className="h-6 w-6" />
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