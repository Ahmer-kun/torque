import { ReactNode } from "react";
import { motion } from "motion/react";

interface StorySectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  delay?: number;
}

// Child variant for individual lines of text
export const revealLineVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // Dreamy easeOutExpo
    },
  },
};

export default function StorySection({
  id,
  className = "",
  children,
  delay = 0.05,
}: StorySectionProps) {
  return (
    <section
      id={id}
      className={`min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 py-20 relative select-none z-10 ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-25%" }} // triggers on entering/switching sections
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.65, // gorgeous atmospheric pacing for line-by-line reveal
              delayChildren: delay,
            },
          },
        }}
        className="w-full max-w-3xl flex flex-col items-center justify-center text-center"
      >
        {children}
      </motion.div>
    </section>
  );
}
