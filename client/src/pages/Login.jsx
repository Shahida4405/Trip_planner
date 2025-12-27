import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");
        // Save user info if needed
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/"); // redirect after login
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#FFF1DA]">
      <div className="w-full md:w-[60%] bg-white flex flex-col gap-6 rounded-md p-4">
        <h1 className="text-center text-3xl font-bold text-gray-800 mt-4">
          Welcome to <span className="text-[#6358DC]">Trevo</span>
        </h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6 px-4">
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
          <button
            type="submit"
            className="w-full bg-[#EB662B] text-white p-3 rounded-md"
          >
            {loading ? "Loading..." : "Login"}
          </button>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#EB662B]">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
