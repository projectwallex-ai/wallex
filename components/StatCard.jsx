'use client';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value }) {
  return (
    <motion.div
      className="p-5 rounded-2xl border border-indigo-800/40 bg-gradient-to-br from-[#0b1b2d] to-[#0a1422] 
                 shadow-lg hover:shadow-indigo-600/20 flex flex-col items-start transition-all duration-300"
      whileHover={{ scale: 1.03, borderColor: 'rgba(99,102,241,0.6)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-indigo-400 text-2xl">{icon}</div>
        <h4 className="text-lg font-semibold text-white">{label}</h4>
      </div>

      <motion.div
        className="text-2xl font-bold text-cyan-400 drop-shadow-sm mt-1"
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {value || '—'}
      </motion.div>
    </motion.div>
  );
}
