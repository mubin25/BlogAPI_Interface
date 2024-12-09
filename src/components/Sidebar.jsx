import React from "react";
import { Link } from "react-router-dom";
// Import icons from react-icons
import { FaHome, FaPen, FaUser } from 'react-icons/fa'; // FaHome, FaPen, FaUser are the icons we are using

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-2">
      <div className="space-y-6">
      
        <ul className="space-y-4">
          <li>
            <Link to="/blog" className="flex items-center py-2 hover:bg-gray-700 px-4 rounded">
              <FaHome className="mr-2 text-xl" /> {/* Home icon */}
              View Blogs
            </Link>
          </li>
          <li>
            <Link to="/blog/create" className="flex items-center py-2 hover:bg-gray-700 px-4 rounded">
              <FaPen className="mr-2 text-xl" /> {/* Pen icon */}
              Create Blog
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center py-2 hover:bg-gray-700 px-4 rounded">
              <FaUser className="mr-2 text-xl" /> {/* User icon */}
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
