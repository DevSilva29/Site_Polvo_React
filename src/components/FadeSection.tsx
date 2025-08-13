import { motion } from "framer-motion";
import { ReactNode } from "react";

type FadeSectionProps = {
  children: ReactNode;
};

export const FadeSection = ({ children }: FadeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};
