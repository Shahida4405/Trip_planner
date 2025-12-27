import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeLink = location.pathname;

  const linkClass = (path) =>
    `relative font-medium transition-all duration-200
     after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 
     after:bg-blue-600 after:transition-all after:duration-300 
     hover:after:w-full hover:text-blue-600
     ${activeLink === path ? "text-blue-600 after:w-full" : "text-gray-700"}`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight hover:scale-105 transition-transform">
            Trevo
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-lg">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/search" className={linkClass("/search")}>Bookings</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
          <Link to="/contact" className={linkClass("/contact")}>Contact</Link>
          <Link to="/blog" className={linkClass("/blog")}>Blog</Link>
        </nav>

        {/* Profile / Login */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link
              to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
              className="relative group"
            >
              <img
                src={
                  currentUser?.avatar
                    ? `http://localhost:8000/images/${currentUser.avatar}`
                    : defaultProfileImg
                }
                alt="avatar"
                className="w-11 h-11 rounded-full border-2 border-gray-200 object-cover 
                           group-hover:ring-2 group-hover:ring-blue-500 transition-all"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 text-white font-semibold rounded-full 
                         bg-gradient-to-r from-blue-600 to-blue-400 
                         hover:shadow-lg hover:scale-105 transition-all"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="text-3xl md:hidden focus:outline-none text-blue-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md animate-slideDown">
          <ul className="flex flex-col gap-4 px-6 py-4 text-lg">
            <Link to="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/search" className={linkClass("/search")} onClick={() => setMenuOpen(false)}>Bookings</Link>
            <Link to="/about" className={linkClass("/about")} onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className={linkClass("/contact")} onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/blog" className={linkClass("/blog")} onClick={() => setMenuOpen(false)}>Blog</Link>
            {currentUser ? (
              <Link
                to={`/profile/${currentUser.user_role === 1 ? "admin" : "user"}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 mt-2"
              >
                <img
                  src={
                    currentUser?.avatar
                      ? `http://localhost:8000/images/${currentUser.avatar}`
                      : defaultProfileImg
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <span className="font-medium text-blue-700">Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-center hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
