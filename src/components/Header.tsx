import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="w-full px-4 mx-auto sm:max-w-3xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <motion.img
                src="/logo.png"
                alt="CalSnap Logo"
                className="w-full h-full object-contain"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="flex flex-col">
              <motion.span 
                className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                whileHover={{ scale: 1.02 }}
              >
                CalSnap
              </motion.span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Track smarter, live better
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
