import { motion } from "motion/react";

export const staggerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function StaggerContainer({ children, className = "" }) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
