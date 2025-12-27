import { FaRobot, FaGlobeAsia, FaPlane, FaUsers } from "react-icons/fa";

export default function WhoAreWe() {
  return (
    <section className="bg-gradient-to-r from-blue-100 via-pink-50 to-purple-100 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-purple-700 mb-6">Who Are We?</h2>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
          We are <span className="font-semibold text-pink-600">AI Trip Planner</span>, 
          your smart travel companion. Our mission is to make your journey stress-free 
          by planning customized trips with the power of Artificial Intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <FaRobot className="text-purple-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-700">AI Powered</h3>
            <p className="text-gray-600 mt-2">
              Smart recommendations tailored for your interests.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <FaGlobeAsia className="text-pink-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-700">Global Coverage</h3>
            <p className="text-gray-600 mt-2">
              Explore destinations across the world with ease.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <FaPlane className="text-blue-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-pink-600">Seamless Travel</h3>
            <p className="text-gray-600 mt-2">
              Book hotels, transport & experiences effortlessly.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
            <FaUsers className="text-purple-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-700">Customer First</h3>
            <p className="text-gray-600 mt-2">
              24/7 support to make your journey memorable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
