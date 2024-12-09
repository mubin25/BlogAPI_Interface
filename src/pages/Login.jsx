import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import api from "../services/api";
import Swal from 'sweetalert2';

const Login = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL; 

  console.log("BASE_URL",BASE_URL);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const response = await api.post(`${BASE_URL}/login`, formData);
      const { token } = response.data;
  
      // Save the token in localStorage
      localStorage.setItem("userToken", token);
  
      // Show success alert using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'You have logged in successfully.',
      });
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
  
      
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
  
      // Show error alert using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Invalid Credentials',
        text: 'Please check your email and password and try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          type="email"
          name="username"
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
