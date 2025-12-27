import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Footer from "./pages/components/Footer";
import AskAIModal from "./pages/components/AskAIModal";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { FaRobot } from "react-icons/fa";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [aiReply, setAIReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (question) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      const response = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAIReply(response || "No answer from AI.");
    } catch (error) {
      console.error(error);
      setAIReply("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="max-w-7xl mx-auto py-24">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* Package Routes */}
            <Route path="/package" element={<Package />} /> {/* For category listing */}
            <Route path="/package/:id" element={<Package />} /> {/* Single package */}
            <Route path="/package/ratings/:id" element={<RatingsPage />} />

            {/* Booking (Protected) */}
            <Route path="/booking/:packageId" element={<PrivateRoute />}>
              <Route index element={<Booking />} />
            </Route>

            {/* User Profile (Protected) */}
            <Route path="/profile/user" element={<PrivateRoute />}>
              <Route index element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/profile/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="update-package/:id" element={<UpdatePackage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<p className="text-center mt-10">404 - Page Not Found</p>} />
          </Routes>
        </div>

        <ToastContainer />
        <Footer />
      </BrowserRouter>

      {/* AI Assistant Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl animate-bounce"
      >
        <FaRobot size={24} />
      </button>

      {/* AI Modal */}
      <AskAIModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAsk={handleAsk}
        reply={aiReply}
        loading={loading}
      />
    </>
  );
};

export default App;
