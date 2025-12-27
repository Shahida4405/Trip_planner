import weather from "../../assets/images/weather.png";
import plane from "../../assets/images/plane.png";
import event from "../../assets/images/event.png";
import setting from "../../assets/images/setting.png";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      id: 1,
      image: weather,
      title: "Calculated Weather",
      description: "Built Wicket longer admire do barton vanity itself do in it.",
    },
    {
      id: 2,
      image: plane,
      title: "Best Flights",
      description: "Engrossed listening. Park gate sell they west hard for the.",
    },
    {
      id: 3,
      image: event,
      title: "Local Events",
      description:
        "Barton vanity itself do in it. Preferd to men it engrossed listening.",
    },
    {
      id: 4,
      image: setting,
      title: "Customization",
      description:
        "We deliver outsourced aviation services for military customers",
    },
  ];

  // Framer motion variants for the grid items
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    hover: {
      scale: 1.05,
      y: -5,
      rotate: [0, 2, -2, 0], // slight tilt movement
      transition: { duration: 0.5, repeat: Infinity, repeatType: "mirror" },
    },
  };

  return (
    <div className="py-6 relative">
      <h1 className="text-center text-gray-700 text-xl font-semibold">
        CATEGORY
      </h1>

      <motion.div
        className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="max-w-[267px] h-[314px] w-full mx-auto flex flex-col items-center justify-center gap-3 shadow-md rounded-xl bg-gradient-to-tr from-blue-50 to-white cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.img
              src={service.image}
              className="w-16 h-16"
              alt={service.title}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
            />
            <h4 className="text-lg font-semibold text-blue-700">{service.title}</h4>
            <p className="max-w-[200px] w-full mx-auto text-sm text-center text-gray-600">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
