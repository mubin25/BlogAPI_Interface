import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import Headers from "../components/Header";
import { FaEdit, FaTrash, FaThumbsUp } from "react-icons/fa";
import Loader from "../components/Loader";

const BlogList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`${BASE_URL}/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogPosts(response.data);
    } catch (error) {
      console.error("Error fetching blog posts:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleEdit = (post) => {
    navigate(`/blog/edit/${post._id}`, { state: { post } });
  };

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const response = await axios.delete(`${BASE_URL}/blog`, {
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire("Deleted!", "Your blog post has been deleted.", "success");
        fetchBlogPosts();
      } else {
        Swal.fire("Failed!", "There was a problem deleting the blog post.", "error");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error.response?.data || error.message);
      Swal.fire("Failed!", "There was a problem deleting the blog post.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${BASE_URL}/blog/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Liked!", "You liked this blog post.", "success");
        fetchBlogPosts();
      } else {
        Swal.fire("Failed!", "There was a problem liking the blog post.", "error");
      }
    } catch (error) {
      console.error("Error liking blog post:", error.response?.data || error.message);
      Swal.fire("Failed!", "There was a problem liking the blog post.", "error");
    }
  };

  // Exclude top 4 blog posts
  const filteredBlogPosts = blogPosts.slice(4);

  return (
    <>
      <Headers />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700">All Blog Posts</h1>
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-6">
              {filteredBlogPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
                >
                {/*<img
      src={`https://blogapitaskindrajala.onrender.com/${post.image}`} // External or local URL
      alt={post.title}
      className="w-full h-64 object-cover rounded-md" // Styling the image
    />*/}
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-600">{post.title}</h2>
                    <p className="text-gray-600 mt-2">{post.description}</p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="text-blue-500 hover:text-blue-600 transition text-xl"
                      title="Like"
                    >
                      <FaThumbsUp />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-yellow-500 hover:text-yellow-600 transition text-xl"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:text-red-600 transition text-xl"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
