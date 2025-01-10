import { motion } from 'framer-motion';

const screenshots = [
  {
    src: '/screenshots/preview-1.png',
    alt: 'Track your daily calories',
    title: 'Track Daily Calories'
  },
  {
    src: '/screenshots/preview-2.png',
    alt: 'AI-powered food recognition',
    title: 'Smart Food Recognition'
  },
  {
    src: '/screenshots/preview-3.png',
    alt: 'Achievement system',
    title: 'Earn Achievements'
  },
  {
    src: '/screenshots/preview-4.png',
    alt: 'Progress tracking',
    title: 'Track Progress'
  }
];

export function ScreenshotGallery() {
  return (
    <div className="overflow-hidden">
      <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {screenshots.map((screenshot, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-none w-[280px] snap-center"
          >
            <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
