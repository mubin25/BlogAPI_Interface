import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    photo: null,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const { name, email, password, phoneNumber, photo } = formData;
    let valid = true;
    const newErrors = { name: "", email: "", password: "", phoneNumber: "", photo: "" };

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required!";
      valid = false;
    }

    // Email validation (basic format check)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address!";
      valid = false;
    }

    // Password validation (at least one uppercase, one lowercase, one digit, and one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    // Phone number validation (basic check, numbers only and length)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number (10 digits).";
      valid = false;
    }

    // Photo validation
    if (!photo) {
      newErrors.photo = "Please upload a profile photo!";
      valid = false;
    }

    // Validate file type (JPEG or PNG)
    const validImageTypes = ["image/jpeg", "image/png"];
    if (photo && !validImageTypes.includes(photo.type)) {
      newErrors.photo = "Invalid photo format. Only JPEG and PNG are allowed.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before proceeding
    if (!validateForm()) {
      return;
    }

    const { name, email, password, phoneNumber, photo } = formData;

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber);
    form.append("photo", photo);

    try {
      setLoading(true);
      const response = await axios.post(
       `${BASE_URL}/register`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data === "New User Created") {
        navigate("/login");
      } else {
        // Handle server-side error (show errors in the form if needed)
        setErrors({ ...errors, server: "Registration Failed. Please try again." });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ ...errors, server: "An error occurred. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[101%] flex justify-center items-center bg-gray-100 overflow-hidden">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                required
                accept="image/jpeg, image/png"
                className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm"
              />
              {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
            </div>
            {errors.server && <p className="text-red-500 text-sm mt-2">{errors.server}</p>}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
