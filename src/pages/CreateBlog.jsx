import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import Sidebar from "../components/Sidebar";
import Headers from "../components/Header";

const CreateBlog = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      if (image) {
        formData.append("image", image); // Append image if selected
      }

      // Get the token from localStorage
      const token = localStorage.getItem("userToken"); 

      const response = await axios.post(
        `${BASE_URL}/blog`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header for FormData
            "Authorization": `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      if (response.data === "Blog created successfully") {
        Swal.fire("Success!", "Blog post created successfully!", "success");
        navigate("/blog"); // Redirect to the blog list after successful creation
      } else {
        Swal.fire("Error", "Failed to create blog post.", "error");
      }
    } catch (error) {
      console.error("Error creating blog post:", error.response?.data || error.message);
      Swal.fire("Error", "Failed to create blog post.", "error");
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
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">Create New Blog Post</h1>
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
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
