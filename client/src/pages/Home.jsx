import React, { useCallback, useEffect, useState } from "react";
import "./styles/Home.css";
import { FaCalendar, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";
import Services from "./components/Services";
import Top from "./components/Top";
import HeroImage from "./components/HeroImage";
import WhyChooseUs from "./components/WhyChooseUs";
import Offers from "./components/Offers";
import SingleCard from "./components/SingleCard";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ItineraryPlanner from "./components/ItineraryPlanner";
import Package from "./Package";

// ✅ Background image
import bg_jmg1 from "../assets/images/bg_jmg1.jpg";

// ✅ Country images in public folder
const countries = [
  { name: "France", img: "/images/france.jpg" },
  { name: "Italy", img: "/images/italy.jpg" },
  { name: "Japan", img: "/images/japan.jpg" },
  { name: "Australia", img: "/images/Australia.jpg" },
  { name: "USA", img: "/images/Usa.jpg" },
  { name: "Brazil", img: "/images/Brazil.jpeg" },
  { name: "Canada", img: "/images/Canada.jpg" },
  { name: "Germany", img: "/images/Germany.png" },
  { name: "India", img: "/images/india.jpg" },
  { name: "China", img: "/images/China.jpg" },
  { name: "Thailand", img: "/images/tailland.jpg" },
  { name: "Spain", img: "/images/spain.jpg" },
  { name: "Egypt", img: "/images/egypt.jpg" },
  { name: "South Africa", img: "/images/southafrica.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Fetch functions
  const fetchPackages = useCallback(async (sort, offer = false, limit = 8) => {
    try {
      setLoading(true);
      const query = `/api/package/get-packages?sort=${sort}&offer=${offer}&limit=${limit}`;
      const res = await fetch(query);
      const data = await res.json();
      setLoading(false);
      return data.success ? data.packages : [];
    } catch (error) {
      console.log(error);
      setLoading(false);
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      const top = await fetchPackages("packageRating");
      const latest = await fetchPackages("createdAt");
      const offers = await fetchPackages("createdAt", true, 6);
      setTopPackages(top);
      setLatestPackages(latest);
      setOfferPackages(offers);
    })();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="main w-full">
      {/* Background */}
      <div
        className="full-page-background"
        style={{ backgroundImage: `url(${bg_jmg1})` }}
      ></div>

      {/* Components */}
      <HeroImage />
      <Services />
      <Top />

      {/* Itinerary Planner */}
      <div className="px-6 mt-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
          Plan Your Perfect Trip ✈️
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Use our Smart Itinerary Generator to customize your travel experience
        </p>
        <ItineraryPlanner />
      </div>

      {/* Country Carousel */}
      <div className="px-6 mt-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Explore by Country</h2>
        <p className="text-gray-600 mb-6">Famous destinations from around the world 🌍</p>
        <Slider {...sliderSettings}>
          {countries.map((c, i) => (
            <div
              key={i}
              onClick={() => navigate(`/package?category=${c.name}`)}
              className="p-2 cursor-pointer"
            >
              <div
                className="h-40 rounded-xl shadow-lg flex items-end justify-center text-white text-lg font-bold"
                style={{
                  backgroundImage: `url(${c.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="bg-black bg-opacity-50 w-full text-center py-2">{c.name}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Packages */}
      <Package />

      {/* Main Packages */}
      <div className="main p-6 flex flex-col gap-5">
        {loading && <h1 className="text-center text-2xl text-blue-600 font-semibold">Loading...</h1>}

        {/* Top Packages */}
        {topPackages.length > 0 && (
          <>
            <h1 className="text-2xl font-semibold text-blue-800">Top Packages</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {topPackages.map((pkg, i) => (
                <SingleCard key={i} packageData={pkg} backendUrl={backendUrl} />
              ))}
            </div>
          </>
        )}

        {/* Latest Packages */}
        {latestPackages.length > 0 && (
          <>
            <h1 className="text-2xl font-semibold text-blue-800">Latest Packages</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {latestPackages.map((pkg, i) => (
                <SingleCard key={i} packageData={pkg} backendUrl={backendUrl} />
              ))}
            </div>
          </>
        )}

        {/* Offer Packages */}
        {offerPackages.length > 0 && (
          <>
            <h1 className="text-2xl font-semibold text-blue-900">Special Offers</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {offerPackages.map((pkg, i) => (
                <Offers key={i} packageData={pkg} backendUrl={backendUrl} /> 
              ))}
            </div>
          </>
        )}
      </div>

      <WhyChooseUs />
    </div>
  );
};

export default Home;
