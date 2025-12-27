import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../assets/images/login.png";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
      setPasswordStrength("Strong");
    } else if (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      setPasswordStrength("Medium");
    } else if (password.length < 6) {
      setPasswordStrength("Weak");
    } else {
      setPasswordStrength("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      if (res?.data?.success) {
        toast.success(res.data.message || "Signup successful!");
        navigate("/login");
      } else {
        toast.error(res?.data?.message || "Signup failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#FFF1DA]">
      <div className="w-full md:w-[60%] bg-white flex flex-col gap-6 rounded-md p-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mt-4">
          Signup into <span className="text-[#FF7D68]">Trevo</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={loginImage} alt="Signup" className="max-h-[300px]" />
          </div>
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col gap-4">
            <input
              type="text"
              name="username"
              placeholder="Your Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-gray-200 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-gray-200 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-gray-200 outline-none"
            />
            {passwordStrength && (
              <p
                className={`text-sm mt-1 ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength} Password
              </p>
            )}
            <textarea
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-gray-200 outline-none"
            />
            <input
              type="tel"
              name="phone"
              placeholder="10-digit Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className="w-full p-3 border rounded-md bg-gray-200 outline-none"
            />
            <button className="w-full bg-[#EB662B] text-white p-3 rounded-md">
              Signup
            </button>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#EB662B]">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
