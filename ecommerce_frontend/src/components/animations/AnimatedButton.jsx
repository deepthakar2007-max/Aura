import { motion } from "motion/react";

export default function AnimatedButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
