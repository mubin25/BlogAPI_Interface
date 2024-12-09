import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import Sidebar from "../components/Sidebar";
import Headers from "../components/Header";
import Loader from "../components/Loader";

const EditBlog = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const { state } = useLocation();
  const post = state?.post; // Get the post object passed via navigate()

  const [title, setTitle] = useState(post ? post.title : "");
  const [description, setDescription] = useState(post ? post.description : "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("id", post._id); // Add the blog post ID here
      if (image) {
        formData.append("image", image); // Add image to FormData if selected
      }

      // Log form data to check the content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Get the token from localStorage (assuming it's stored there)
      const token = localStorage.getItem('userToken');

      // Make the PUT request to update the blog post
      const response = await axios.put(
        `${BASE_URL}/blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header for FormData
            "Authorization": `Bearer ${token}`, // Add Bearer token for authorization
          },
        }
      );

      // Log response to check for success
      console.log("Response:", response);

      if (response.status === 200) {
        Swal.fire("Success!", "Blog post updated successfully!", "success");
        navigate("/blog"); // Redirect to the blog list after update
      } else {
        Swal.fire("Error", "Failed to update the blog post.", "error");
      }
    } catch (error) {
      console.error("Error updating blog post:", error.response?.data || error.message);
      Swal.fire("Error", "Failed to update blog post.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Headers />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">Edit Blog Post</h1>
          {loading ? (
           <Loader/>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog Title"
                className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Blog Description"
                className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="file"
                name="image"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="w-full border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">
                {loading ? "Updating..." : "Update Post"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditBlog;
