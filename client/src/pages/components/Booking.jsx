import destination from "../../assets/images/destination.png";
import payment from "../../assets/images/payment.png";
import vehicle from "../../assets/images/vehicle.png";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

const Booking = () => {
  const { packageId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/package/get-package-data/${packageId}`);
        const data = await res.json();
        if (data.success) setPackageData(data.packageData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  const steps = [
    {
      id: 1,
      image: destination,
      title: "Choose Destination",
      description: "Select your favorite destination for an amazing trip.",
    },
    {
      id: 2,
      image: payment,
      title: "Make Payment",
      description: "Securely complete your payment to confirm your trip.",
    },
    {
      id: 3,
      image: vehicle,
      title: "Reach Airport on Selected Date",
      description: "Reach the airport on your travel date and enjoy your trip!",
    },
  ];

  if (loading || !packageData) return <p className="text-center mt-10">Loading...</p>;

  // Safe price with discount logic (max 20% discount)
  const safePrice = () => {
    if (packageData.packageOffer && packageData.packageDiscountPrice) {
      const discountAmount = packageData.packagePrice - packageData.packageDiscountPrice;
      const discountPercent = (discountAmount / packageData.packagePrice) * 100;
      const cappedDiscountPercent = Math.min(discountPercent, 20); // max 20%
      return (packageData.packagePrice - (cappedDiscountPercent / 100) * packageData.packagePrice).toFixed(2);
    }
    return packageData.packagePrice.toFixed(2);
  };

  return (
    <div className="my-16">
      {/* Animated Heading */}
      <motion.h4
        className="text-[#DF6951] text-center md:text-start text-lg font-semibold md:text-xl md:font-bold"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        Easy and Fast
      </motion.h4>

      <motion.h1
        className="text-[#181E4B] text-center md:text-start text-5xl font-bold my-4 capitalize"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        Book your next trip in <br /> 3 easy steps
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Left Steps Section */}
        <div className="w-full md:w-1/2 px-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex gap-8 my-2 py-3"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={step.image} alt={step.title} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[#5E6282] text-lg font-semibold md:text-xl md:font-bold">
                  {step.title}
                </h2>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Image Card */}
        <motion.div
          className="w-full md:w-1/2 px-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1.1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-[370px] w-full mx-auto h-[300px] bg-white rounded-md flex flex-col items-center px-3">
            <img
              src={`http://localhost:8000/images/${packageData.packageImages[0]}`}
              className="transition-transform hover:scale-105 duration-300 ease-in-out w-full h-40 object-cover rounded-md"
              alt={packageData.packageName}
            />
            <h1 className="text-gray-800 my-4 text-lg font-semibold md:text-xl md:font-bold">
              {packageData.packageName}
            </h1>
            <div className="flex items-center justify-around gap-3 text-sm text-gray-600">
              <p>{packageData.packageStartDate || "Start Date TBD"}</p> | 
              <p>{packageData.packageDestination}</p>
            </div>
            <div className="flex items-center justify-around gap-5 my-3 text-sm text-gray-700 font-medium">
              <p>{packageData.packagePeople || "N/A"} people going</p>
              <p>₹{safePrice()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
