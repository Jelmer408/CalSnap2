import { Home, Trophy, ChefHat, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface NavItem {
  icon: JSX.Element;
  value: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-6 h-6" />, value: 'home' },
  { icon: <Trophy className="w-6 h-6" />, value: 'achievements' },
  { icon: <ChefHat className="w-6 h-6" />, value: 'mealprep' },
  { icon: <Settings className="w-6 h-6" />, value: 'settings' }
];

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,24px)]">
      <div className="px-6 pb-6">
        <nav className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg pointer-events-auto backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onChange(item.value)}
                className={cn(
                  'flex flex-col items-center py-4 px-2 relative transition-colors min-w-[60px]',
                  activeTab === item.value 
                    ? 'text-blue-500' 
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {activeTab === item.value && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.icon}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
