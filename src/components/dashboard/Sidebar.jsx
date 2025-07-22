// src/components/dashboard/Sidebar.jsx
import { motion } from 'framer-motion';
import { FiHome, FiSettings, FiBarChart2, FiUsers, FiLogOut } from 'react-icons/fi';
import { signOut } from '../../lib/firebase';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const variants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const navItemVariants = {
    hover: { scale: 1.1, x: 5, color: '#a78bfa' }, // Light purple
    tap: { scale: 0.95 },
  };

  const NavItem = ({ icon, text }) => (
    <motion.li
      className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg"
      variants={navItemVariants}
      whileHover="hover"
      whileTap="tap"
    >
      {icon}
      <span className="font-semibold">{text}</span>
    </motion.li>
  );

  return (
    <motion.div
      className="flex flex-col h-screen w-64 bg-gray-900/80 backdrop-blur-md text-gray-300 p-6 border-r border-gray-700/50"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full" />
        <div>
          <h2 className="text-lg font-bold text-white">{user?.displayName || 'User'}</h2>
          <p className="text-xs text-gray-400">Premium Member</p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-3">
          <NavItem icon={<FiHome size={22} />} text="Dashboard" />
          <NavItem icon={<FiBarChart2 size={22} />} text="Analytics" />
          <NavItem icon={<FiUsers size={22} />} text="Team" />
          <NavItem icon={<FiSettings size={22} />} text="Settings" />
        </ul>
      </nav>
      <div>
        <motion.button
          onClick={signOut}
          className="flex items-center space-x-4 w-full p-3 rounded-lg text-red-400"
          variants={navItemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FiLogOut size={22} />
          <span className="font-semibold">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;