import { motion } from "motion/react";

export default function ConfessionCore() {
  const lines = [
    "I like you.",
    "Not in some passing, fleeting way.",
    "Not in a 'this will fade with time' kind of way.",
    "But in a quiet way that stayed...",
    "and grew."
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 1.2, // gorgeous, slow emotional intervals
        delayChildren: 0.3,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1], // easeOutQuint
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      className="flex flex-col gap-6 md:gap-8 items-center"
    >
      {lines.map((line, idx) => {
        const isHighlight = idx === 0 || idx === lines.length - 1;
        return (
          <motion.p
            key={idx}
            variants={lineVariants}
            className={`text-xl md:text-3xl font-serif tracking-wide leading-relaxed ${
              isHighlight
                ? "text-romantic-blush font-semibold text-2xl md:text-4xl"
                : "text-white/80"
            }`}
          >
            {line}
          </motion.p>
        );
      })}
    </motion.div>
  );
}
