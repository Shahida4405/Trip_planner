import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { motion } from "framer-motion";

const socialIcons = [
  { id: 1, icon: <FaFacebookF />, link: "#" },
  { id: 2, icon: <FaTwitter />, link: "#" },
  { id: 3, icon: <FaInstagram />, link: "#" },
  { id: 4, icon: <FaLinkedinIn />, link: "#" },
];

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative overflow-hidden py-12 px-6"
    >
      {/* Animated glowing border box */}
      <motion.div
        animate={{ scale: [1, 1.01, 1], rotate: [0, 0.5, -0.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative max-w-7xl mx-auto rounded-2xl shadow-2xl backdrop-blur-md
                   bg-white/70 border border-blue-300/50 
                   before:absolute before:inset-0 before:rounded-2xl 
                   before:bg-gradient-to-r before:from-blue-400 before:via-purple-400 before:to-blue-500
                   before:blur-xl before:opacity-40 before:-z-10"
      >
        {/* Animated floating cylinders background */}
        <div className="absolute inset-0 flex justify-around items-end opacity-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 md:w-3 lg:w-4 bg-blue-400/60 rounded-full"
              style={{ height: `${30 + i * 20}px` }}
              animate={{ y: [0, -30, 0] }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Footer content */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 p-10">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold mb-4 text-blue-700 hover:text-blue-800 transition-colors">
              Trevo
            </h2>
            <p className="text-sm text-blue-600">
              Explore the world with comfort and confidence. Trevo brings top
              travel experiences to your fingertips.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-blue-600">
              {["Home", "Packages", "About Us", "Contact"].map((item, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 8, color: "#1d4ed8" }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <a href="#">
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Contact Us
            </h3>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="space-y-1 text-sm text-blue-600"
            >
              <p>Email: support@trevo.com</p>
              <p>Phone: +91 7676328601</p>
              <p>Location: India</p>
            </motion.div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              Follow Us
            </h3>
            <div className="flex gap-4 text-xl">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.link}
                  whileHover={{
                    y: -5,
                    scale: 1.3,
                    color: "#1d4ed8",
                    rotate: 5,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-blue-600"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative text-center text-sm border-t border-blue-200 pt-4 text-blue-600"
        >
          © {new Date().getFullYear()} Trevo. All rights reserved.
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
