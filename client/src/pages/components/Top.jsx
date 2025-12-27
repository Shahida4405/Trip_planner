import t1 from "../../assets/images/t1.jpg";
import t2 from "../../assets/images/t2.jpg";
import t3 from "../../assets/images/t3.jpg";
import t4 from "../../assets/images/t4.jpg";
import { motion } from "framer-motion";

const Top = () => {
  const topSellings = [
    {
      id: 1,
      image: t1,
      destination: "Goa Beaches",
      price: "₹10000",
      duration: "5 days",
      color: "from-pink-50 to-pink-100 border-pink-200",
    },
    {
      id: 2,
      image: t2,
      destination: "Taj Mahal",
      price: "₹20000",
      duration: "5 days",
      color: "from-green-50 to-green-100 border-green-200",
    },
    {
      id: 3,
      image: t3,
      destination: "Mumbai City Tour",
      price: "₹30000",
      duration: "6 days",
      color: "from-purple-50 to-purple-100 border-purple-200",
    },
    {
      id: 4,
      image: t4,
      destination: "Kerala Backwaters",
      price: "₹20000",
      duration: "10 days",
      color: "from-yellow-50 to-yellow-100 border-yellow-200",
    },
  ];

  return (
    <div className="w-full mx-auto my-12 px-6">
      <h1 className="text-center text-gray-700 text-2xl font-semibold">
        Top Selling
      </h1>
      <h1 className="my-2 text-center text-gray-900 text-4xl font-bold">
        Top Destinations
      </h1>

      <motion.div
        className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 } }, // stagger animation
        }}
      >
        {topSellings.map((item) => (
          <motion.div
            key={item.id}
            className={`mx-auto flex flex-col items-center justify-center rounded-2xl border shadow-md p-4 bg-gradient-to-br ${item.color} cursor-pointer`}
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
            }}
            whileHover={{ scale: 1.05, y: -5, transition: { type: "spring", stiffness: 200 } }}
          >
            <div className="w-full h-[250px] overflow-hidden rounded-xl">
              <motion.img
                src={item.image}
                className="w-full h-full object-cover rounded-xl"
                alt={item.destination}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center justify-between w-full mt-3 px-2">
              <h4 className="text-lg font-semibold text-gray-800">
                {item.destination}
              </h4>
              <p className="text-lg font-bold text-blue-600">{item.price}</p>
            </div>

            <p className="text-sm text-gray-500 mb-3">{item.duration}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Top;
