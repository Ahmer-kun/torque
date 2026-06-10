import { motion } from "motion/react";
import { Heart, Sparkles, Compass } from "lucide-react";

interface PersonalizedItem {
  text: string;
  subtext: string;
  icon: any;
}

export default function PersonalTouch() {
  // DECLARATIVE AND EDITABLE CONTENT:
  // Anyone can easily change, delete, or append compliments here.
  const reasons: PersonalizedItem[] = [
    {
      text: "The way you explain things like they truly matter.",
      subtext: "Your enthusiasm brings light to even the simplest topics.",
      icon: Sparkles,
    },
    {
      text: "How you show up, even when you don't have to.",
      subtext: "A silent, steady reliability that makes the world feel safe.",
      icon: Compass,
    },
    {
      text: "The calm I feel when I talk to you.",
      subtext: "Like noise fades away, and everything aligns into place.",
      icon: Heart,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="mb-10 text-center">
        <h3 className="font-serif text-2xl md:text-3xl mt-2 text-white font-light">
          The little things you do...
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="flex flex-col gap-6"
      >
        {reasons.map((reason, idx) => {
          const IconComponent = reason.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{
                y: -4,
                borderColor: "rgba(207, 161, 74, 0.4)",
                backgroundColor: "rgba(18, 18, 24, 0.8)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(207, 161, 74, 0.05)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-6 md:p-8 rounded-2xl bg-romantic-card/45 border border-white/5 backdrop-blur-sm transition-colors text-left flex gap-5 items-start group"
            >
              <div className="p-3 rounded-xl bg-romantic-red/10 border border-romantic-red/20 group-hover:bg-romantic-gold/10 group-hover:border-romantic-gold/30 class-transition-all duration-300">
                <IconComponent className="w-5 h-5 text-romantic-blush group-hover:text-romantic-gold transition-colors duration-300" />
              </div>
              
              <div className="flex-1">
                <p className="text-base md:text-lg text-white font-medium tracking-wide">
                  "{reason.text}"
                </p>
                <span className="text-xs md:text-sm text-white/50 block mt-1.5 font-sans font-light">
                  {reason.subtext}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
