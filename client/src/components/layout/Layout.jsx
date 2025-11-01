import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar (Stays fixed at the top) */}
            <Navbar />

            {/* Main content wrapper with padding-top to offset navbar height */}
            {/* The bg-base-200 provides the nice contrast background */}
            <div className="flex flex-1 justify-center pt-16 bg-base-200">
                
                {/* --- Column 1: Sidebar (Left) --- */}
                {/* 'w-60' sets a fixed width. 'hidden md:block' hides it on mobile. */}
                <aside className="w-60 hidden md:block p-4">
                    {/* This inner div sticks to the top (20 = 16 for navbar + 4 for padding) */}
                    <div className="sticky top-20">
                        <Sidebar />
                    </div>
                </aside>

                {/* --- Column 2: Main Feed (Center) --- */}
                {/* 'flex-1' lets it grow, 'max-w-xl' stops it from getting too wide. */}
                <main className="flex-1 max-w-xl p-4">
                    {/* Your FeedPage, ProfilePage, etc. will render here */}
                    {children}
                </main>

                {/* --- Column 3: Widgets (Right) --- */}
                {/* 'w-72' sets a fixed width. 'hidden lg:block' hides it on mobile/tablet. */}
                <aside className="w-72 hidden lg:block p-4">
                    <div className="sticky top-20">
                        {/* Placeholder for "Who to follow", etc. */}
                        <div className="card bg-base-100 shadow-md p-4">
                            <h2 className="font-bold text-lg mb-2">Who to follow</h2>
                            <p className="text-sm text-base-content/70">
                                Suggestions coming soon!
                            </p>
                            {/* You can map user suggestions here later */}
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default Layout;