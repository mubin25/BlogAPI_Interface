import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Headers from "../components/Header";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const Profile = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL; 

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
  
      // Get the token from localStorage or another place where it's stored
      const token = localStorage.getItem("userToken");
  
      // Set up the headers
      const headers = {
        Authorization: token ? `Bearer ${token}` : "", // Add the Bearer token if it exists
        "Content-Type": "application/json", // Adjust content type as needed
      };
  
      // Make the API call with headers
      const response = await api.get(`${BASE_URL}/profile`, { headers });
  
      // Set the profile data
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
      
      // Show error message with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch profile data.',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken"); 
  
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You need to be logged in to update your profile.',
        });
        return;
      }
  
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
  
      // Make the API request with the Authorization header
      await api.put("/profile", form, {
      
          headers: {
            'Authorization': `Bearer ${token}`,  // Add the Authorization header
            'Content-Type': 'application/json', // Set Content-Type header to JSON
          },
      
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
      });
  
      setEditMode(false);
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  

const handleDeleteProfile = async () => {
  // Display SweetAlert2 confirmation dialog
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete my account',
    cancelButtonText: 'No, keep it',
    reverseButtons: true,  // Ensure buttons are in reverse order
  });

  if (!result.isConfirmed) return; // If the user clicked "Cancel", stop here

  try {
    setLoading(true);

    // Fetch the token from localStorage or wherever you store it
    const token = localStorage.getItem("userToken");

    // Ensure the token is available
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'No Token Found',
        text: 'Please login again.',
      });
      navigate("/login");
      return;
    }

    // Send a DELETE request with the appropriate headers and baseURL
    const response = await api.delete(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Add the token to the headers for authentication
        'Content-Type': 'application/json',  // Set Content-Type to application/json
      },
     
    });

    if (response.data === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Account Deleted',
        text: 'Your account has been deleted successfully.',
      });
      localStorage.removeItem("userToken");
      navigate("/register");
    } else {
      // Handle any unexpected status
      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: 'Failed to delete account. Please try again.',
      });
    }
  } catch (error) {
    console.error("Error deleting profile:", error.response?.data || error.message);
    Swal.fire({
      icon: 'error',
      title: 'Deletion Failed',
      text: 'Failed to delete account. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <>
      <Headers />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">Profile</h1>
          {profile ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              {!editMode ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-600">Description: {profile.briefDescription}</h2>
                    <p className="text-gray-600 mt-2">Deatail Description: {profile.detailedDescription}</p>
                    {/* <p className="text-gray-600 mt-2">Phone Number: {profile.phoneNumber}</p> */}
                    <p className="text-gray-600 mt-2">Address: {profile.address || "N/A"}</p>
                    <p className="text-gray-600 mt-2">Favourite Items: {profile.favouriteItems || "N/A"}</p>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-indigo-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-600 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteProfile}
                      className="bg-red-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                    >
                      Delete Account
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      defaultValue={profile.address || ""}
                      className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="favouriteItems"
                      placeholder="Favourite Items"
                      defaultValue={profile.favouriteItems || ""}
                      className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="briefDescription"
                      placeholder="Brief Description"
                      defaultValue={profile.briefDescription || ""}
                      className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="detailedDescription"
                      placeholder="Detailed Description"
                      defaultValue={profile.detailedDescription || ""}
                      className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-600">No profile found. Please try logging in again.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
