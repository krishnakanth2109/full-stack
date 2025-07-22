// src/components/dashboard/Header.jsx
import { motion } from 'framer-motion';
import { FiSearch, FiBell } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { user } = useAuthStore();
  const variants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
  };

  return (
    <motion.header
      className="flex justify-between items-center py-6"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user?.displayName || user?.email}</p>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="relative text-gray-400 hover:text-white">
          <FiBell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 bg-gray-700 rounded-full">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full" />
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;