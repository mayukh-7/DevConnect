// src/components/layout/SearchResultItem.jsx
import { Link } from "react-router-dom";

const SearchResultItem = ({ user, onUserClick }) => {
    return (
        <li>
            <Link 
                to={`/profile/${user.username}`} 
                onClick={onUserClick}
                className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg"
            >
                <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                        <img 
                            src={user.ProfilePic || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                            alt={user.username} 
                        />
                    </div>
                </div>
                <span className="font-medium text-sm">{user.username}</span>
            </Link>
        </li>
    );
};

export default SearchResultItem;