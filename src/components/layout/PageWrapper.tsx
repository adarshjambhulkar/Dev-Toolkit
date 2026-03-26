import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface PageWrapperProps {
  activeKey: string;
  children: React.ReactNode;
}

const variants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

export function PageWrapper({ activeKey, children }: PageWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
