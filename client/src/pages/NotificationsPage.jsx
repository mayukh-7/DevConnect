import { useEffect } from "react";
import { useNotificationStore } from "../store/useNotificationStore";
import { NavLink } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, Trash2, Home} from "lucide-react";

const NotificationsPage = () => {
    const { notifications, isLoading, getNotifications, clearNotifications } = useNotificationStore();

    useEffect(() => { getNotifications(); }, [getNotifications]);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <NavLink to="/" end> {/* 'end' prop ensures active class only for exact match */}
                    <Home className="h-5 w-5" />
                    Home
                </NavLink>
                <button onClick={clearNotifications} className="btn btn-ghost btn-sm text-error">
                    <Trash2 size={18} className="mr-2" /> Clear All
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center"><span className="loading loading-spinner"></span></div>
            ) : notifications.length === 0 ? (
                <p className="text-center text-base-content/60">No new notifications!</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div key={n._id} className="card bg-base-100 shadow-sm p-4 flex flex-row items-center gap-4">
                            {/* Type Icon */}
                            {n.type === "like" && <Heart className="text-red-500 fill-current" />}
                            {n.type === "comment" && <MessageCircle className="text-blue-500" />}
                            {n.type === "follow" && <UserPlus className="text-green-500" />}

                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={n.from.ProfilePic || "https://ui-avatars.com/api/?name=" + n.from.username} />
                                </div>
                            </div>

                            <div className="flex-1">
                                <span className="font-bold">@{n.from.username}</span> 
                                {n.type === "like" && " liked your post"}
                                {n.type === "comment" && " commented on your post"}
                                {n.type === "follow" && " started following you"}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;