import type { ReactNode } from 'react';
import { motion } from 'motion/react';

/** Einheitlicher Seiten-Wrapper mit sanftem Übergang */
export default function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      id="inhalt"
      tabIndex={-1}
      className="outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.main>
  );
}
