'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataRefreshBar({ isFetching }: { isFetching: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 400); // Wait for finish animation
      return () => clearTimeout(t);
    }
  }, [isFetching]);

  return (
    <div className="absolute top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: isFetching ? '0%' : '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full h-full bg-teal-500"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
