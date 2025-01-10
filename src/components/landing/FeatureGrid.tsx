import { motion } from 'framer-motion';
import { Activity, Zap, Calendar, Trophy, Camera, ChefHat } from 'lucide-react';

const features = [
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Calorie Tracking',
    description: 'Easily track your daily calorie intake with our intuitive interface'
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Quick Add',
    description: 'Quickly add meals with our smart suggestions and recent items'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Progress Tracking',
    description: 'Monitor your progress with detailed charts and insights'
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Achievements',
    description: 'Stay motivated with achievements and streaks'
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: 'Food Recognition',
    description: 'Take photos of your food for automatic calorie estimation'
  },
  {
    icon: <ChefHat className="w-6 h-6" />,
    title: 'Meal Planning',
    description: 'Plan your meals in advance with our meal preparation tools'
  }
];

export function FeatureGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-500 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
