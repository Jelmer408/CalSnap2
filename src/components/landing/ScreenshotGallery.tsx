import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const screenshots = [
  { src: '/screenshots/home.png', alt: 'Home Screen' },
  { src: '/screenshots/meal-log.png', alt: 'Meal Logging' },
  { src: '/screenshots/progress.png', alt: 'Progress Tracking' },
  { src: '/screenshots/achievements.png', alt: 'Achievements' },
];

export function ScreenshotGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-w-9 aspect-h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={screenshots[currentIndex].src}
            alt={screenshots[currentIndex].alt}
            className="object-cover w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-lg"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-lg"
      >
        <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
