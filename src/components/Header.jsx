import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";  // Make sure to import SweetAlert2

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Show the confirmation dialog with SweetAlert2
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    // Check if the user confirmed the logout
    if (confirmation.isConfirmed) {
      // Remove the user data from local storage
      localStorage.removeItem("userToken");
      localStorage.removeItem("user_id");

      // Redirect to login page
      navigate("/login");
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">
        <Link to="/">My Blog App</Link>
      </div>
      <nav className="space-x-4">
        <Link to="/blog" className="hover:text-gray-200">Blog</Link>
        <Link to="/profile" className="hover:text-gray-200">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
