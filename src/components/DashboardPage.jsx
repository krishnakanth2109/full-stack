// src/components/DashboardPage.jsx
import { motion } from 'framer-motion';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import { FiActivity, FiDollarSign, FiUsers, FiShoppingCart } from 'react-icons/fi';

const StatCard = ({ icon, label, value, color }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl flex items-center space-x-4"
      variants={cardVariants}
    >
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1, // Stagger animation for children
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard icon={<FiDollarSign size={24} />} label="Total Revenue" value="$45,231" color="bg-green-500/20 text-green-400" />
          <StatCard icon={<FiShoppingCart size={24} />} label="Total Sales" value="+1,204" color="bg-blue-500/20 text-blue-400" />
          <StatCard icon={<FiUsers size={24} />} label="New Users" value="+316" color="bg-purple-500/20 text-purple-400" />
          <StatCard icon={<FiActivity size={24} />} label="Performance" value="98.5%" color="bg-red-500/20 text-red-400" />
        </motion.div>
        <motion.div
          className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
        >
          <h2 className="text-xl font-semibold text-white">Revenue Analytics</h2>
          <p className="text-gray-400 mt-2">Placeholder for a beautiful chart...</p>
          <div className="h-64 mt-4 bg-gray-900/50 rounded-lg flex items-center justify-center">
            {/* You would typically put a charting library component here */}
            <span className="text-gray-500">Chart Area</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;