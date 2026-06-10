import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, AlertCircle, RefreshCw, Wind } from "lucide-react";

export default function ProposalCard() {
  const [decision, setDecision] = useState<"pending" | "wait" | "accepted">("pending");
  const [showHeartsArray, setShowHeartsArray] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  // Generate some gorgeous random cascading hearts when accepted
  useEffect(() => {
    if (decision === "accepted") {
      const heartsTemp = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage of container width
        y: Math.random() * 50 + 50, // base offset
        delay: Math.random() * 1.5,
      }));
      setShowHeartsArray(heartsTemp);
    }
  }, [decision]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 min-h-[380px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        
        {/* State 1: Propsoal Pending */}
        {decision === "pending" && (
          <motion.div
            key="pending-proposal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-romantic-red/10 border border-romantic-rose/30 flex items-center justify-center text-romantic-blush shadow-[0_0_15px_rgba(139,0,0,0.15)]"
              >
                <Heart className="w-7 h-7 fill-romantic-red text-romantic-rose" />
              </motion.div>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-romantic-gold rounded-full animate-ping" />
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-semibold tracking-wide text-white mb-4">
              So... can I be yours?
            </h2>
            <p className="text-white/60 text-sm md:text-base font-light mb-10 max-w-md text-center">
              No demands, no expectations. Just an honest step forward.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <div className="grid grid-cols-2 gap-4">
                <button
                  id="yes-button"
                  onClick={() => setDecision("accepted")}
                  className="px-6 py-3.5 rounded-xl font-medium tracking-wide bg-gradient-to-r from-romantic-rose to-romantic-red border border-white/10 hover:border-white/20 text-white cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-[0_10px_25px_rgba(163,22,33,0.3)] hover:shadow-[0_15px_30px_rgba(163,22,33,0.5)] outline-none flex items-center justify-center gap-2 group"
                >
                  <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                  Yes
                </button>

                <button
                  id="also-yes-button"
                  onClick={() => setDecision("accepted")}
                  className="px-6 py-3.5 rounded-xl font-medium tracking-wide bg-romantic-black border border-romantic-gold/30 hover:border-romantic-gold/60 text-romantic-gold hover:text-romantic-gold-hover cursor-pointer transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-[0_4px_12px_rgba(19,19,25,0.8)] outline-none flex items-center justify-center gap-1.5 group"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Also Yes
                </button>
              </div>

              <button
                id="need-time-button"
                onClick={() => setDecision("wait")}
                className="text-white/45 hover:text-white/80 transition-colors text-xs font-mono tracking-wider cursor-pointer mt-4 py-2 hover:underline focus:outline-none flex items-center justify-center gap-1.5"
              >
                Need time?
              </button>
            </div>
          </motion.div>
        )}

        {/* State 2: Accepted Celebration Letter */}
        {decision === "accepted" && (
          <motion.div
            key="proposal-accepted"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="w-full relative bg-romantic-card/40 border border-romantic-gold/20 p-8 md:p-12 rounded-2xl backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center overflow-hidden"
          >
            {/* Soft background particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {showHeartsArray.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 0, y: "110%", x: `${heart.x}%`, scale: 0.3 }}
                  animate={{
                    opacity: [0, 0.7, 0.7, 0],
                    y: "-10%",
                    scale: [0.3, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: heart.delay,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute"
                >
                  <Heart className="w-5 h-5 text-romantic-rose fill-romantic-rose opacity-40" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="w-12 h-12 bg-romantic-gold/15 border border-romantic-gold/30 rounded-full flex items-center justify-center text-romantic-gold mx-auto mb-6"
            >
              <Wind className="w-5 h-5" />
            </motion.div>

            <p className="font-serif text-xl md:text-2xl leading-relaxed text-white font-medium mb-6">
              "I was holding my breath..."
            </p>

            <div className="space-y-4 text-white/85 text-sm md:text-base font-light text-left border-t border-white/5 pt-6 leading-relaxed">
              <p>
                Thank you for letting me in, for hearing me out, and for reciprocating exactly what I’ve been feeling inside. 
              </p>
              <p>
                It takes courage to be genuine, and you have made me feel more grounded and valued than you know. Let's take this slow, beautiful step forward together.
              </p>
            </div>

            <div className="mt-8 pt-4 flex justify-center">
              <span className="font-serif italic text-romantic-gold opacity-90 text-sm">
                Forever yours.
              </span>
            </div>
          </motion.div>
        )}

        {/* State 3: Need Time Supportive Screen */}
        {decision === "wait" && (
          <motion.div
            key="proposal-waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-romantic-card/30 border border-white/5 p-8 md:p-10 rounded-2xl backdrop-blur-md shadow-2xl text-center flex flex-col items-center"
          >
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 mb-5">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="font-serif text-2xl text-white font-medium mb-3">
              I'll wait.
            </h3>
            
            <p className="text-white/60 text-sm md:text-base font-light leading-relaxed max-w-md mb-8">
              Take all the time you need. There is absolutely no pressure. The honesty between us matters more than any rush. I’m right here.
            </p>

            <button
              id="return-to-proposal"
              onClick={() => setDecision("pending")}
              className="text-xs font-mono text-romantic-gold hover:text-romantic-gold-hover transition-colors flex items-center gap-2 border border-romantic-gold/20 hover:border-romantic-gold/50 px-4 py-2 rounded-full bg-romantic-gold/5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Return when you are ready
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
