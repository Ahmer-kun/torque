/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ChevronDown, Heart, Sparkles } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";

import BackgroundAmbient from "./components/BackgroundAmbient";
import AudioPlayer from "./components/AudioPlayer";
import StorySection, { revealLineVariant } from "./components/StorySection";
import ConfessionCore from "./components/ConfessionCore";
import PersonalTouch from "./components/PersonalTouch";
import ProposalCard from "./components/ProposalCard";

export default function App() {
  const [activeSection, setActiveSection] = useState("landing");
  const sectionIds = [
    "landing",
    "how-it-started",
    "realization",
    "confession",
    "personal-touch",
    "transition",
    "proposal",
  ];

  // Precise scrolling indicator at the top
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Highlight active sidebar dot based on window scroll intersection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // triggers when section is in the viewport center
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen bg-romantic-black text-white selection:bg-romantic-rose/30 selection:text-romantic-paleblush">
      
      {/* 1. Ambient Background Layer of glowing shapes & embers */}
      <BackgroundAmbient />

      {/* 2. Embedded Dynamic Soundtrack Player */}
      <AudioPlayer />

      {/* 3. Global Glowing Scroll Progress Bar (At the extreme top) */}
      <motion.div
        id="scroll-progress-indicator"
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-romantic-rose via-romantic-blush to-romantic-gold origin-left z-50 shadow-[0_0_8px_rgba(226,125,128,0.5)]"
        style={{ scaleX }}
      />

      {/* 4. Elegant Vertical Progress Dots Navigation */}
      <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-4 items-center px-3.5 py-6 rounded-full bg-romantic-black/40 backdrop-blur-md border border-white/5 shadow-2xl">
        {sectionIds.map((id, index) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => handleScrollTo(id)}
              className="group relative flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
              aria-label={`Go to section ${index + 1}`}
              title={`Section ${index + 1}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  isActive
                    ? "bg-romantic-gold scale-[1.7] shadow-[0_0_8px_rgba(207,161,74,0.7)]"
                    : "bg-white/25 group-hover:bg-white/60 scale-100"
                }`}
              />
              {/* Optional tooltip on hover */}
              <span className="absolute right-7 py-0.5 px-2 rounded bg-[#161622] text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/80 border border-white/5 pointer-events-none uppercase tracking-widest">
                {id.replace("-", " ")}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Content Container */}
      <main className="relative w-full z-10">

        {/* SECTION 1: LANDING (HOOK) */}
        <StorySection id="landing" className="relative">
          <motion.h1 
            variants={revealLineVariant}
            className="font-serif text-3xl md:text-5xl leading-relaxed md:leading-normal font-light tracking-wide max-w-2xl text-white mb-4"
          >
            “I wasn’t planning to say this…”
          </motion.h1>
          <motion.h1 
            variants={revealLineVariant}
            className="font-serif text-3xl md:text-5xl leading-relaxed md:leading-normal italic font-light tracking-wide max-w-2xl text-romantic-blush mb-12"
          >
            “...not like this.”
          </motion.h1>
          
          <motion.div variants={revealLineVariant}>
            <motion.button
              id="continue-button-landing"
              whileHover={{ y: 2, scale: 1.02 }}
              onClick={() => handleScrollTo("how-it-started")}
              className="group px-7 py-3 rounded-full text-xs font-mono tracking-[0.2em] font-medium uppercase border border-white/15 bg-white/5 hover:bg-[#1c1c28] hover:border-romantic-blush/30 hover:text-romantic-blush cursor-pointer transition-all duration-300 flex items-center gap-2"
            >
              Continue
              <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-romantic-blush text-white/50" />
            </motion.button>
          </motion.div>
        </StorySection>


        {/* SECTION 2: HOW IT STARTED */}
        <StorySection id="how-it-started">
          <motion.p 
            variants={revealLineVariant}
            className="font-serif text-2xl md:text-3.5xl leading-relaxed text-white/85 font-light max-w-2xl"
          >
            “Somewhere between random conversations
          </motion.p>
          <motion.p 
            variants={revealLineVariant}
            className="font-serif text-2xl md:text-3.5xl leading-relaxed text-white/85 font-light max-w-2xl mt-1.5"
          >
            and quiet moments…”
          </motion.p>
          <motion.p 
            variants={revealLineVariant}
            className="font-serif text-2xl md:text-3.5xl leading-relaxed text-romantic-gold font-medium max-w-2xl mt-5 mb-12"
          >
            “...you became important.”
          </motion.p>
          
          <motion.div variants={revealLineVariant}>
            <button
              id="continue-button-started"
              onClick={() => handleScrollTo("realization")}
              className="p-2 rounded-full border border-white/10 hover:border-romantic-gold/30 hover:bg-romantic-gold/10 transition-all cursor-pointer group"
              aria-label="Scroll to next segment"
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-romantic-gold" />
            </button>
          </motion.div>
        </StorySection>


        {/* SECTION 3: REALIZATION */}
        <StorySection id="realization">
          <div className="relative max-w-2xl text-center">
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-romantic-rose/5 rounded-full blur-3xl pointer-events-none" />

            <motion.p 
              variants={revealLineVariant}
              className="font-serif text-2xl md:text-3.5xl leading-relaxed text-white/85 font-light relative z-10"
            >
              “I didn’t notice when it changed…”
            </motion.p>
            <motion.p 
              variants={revealLineVariant}
              className="font-serif text-2xl md:text-3.5xl leading-relaxed text-romantic-blush underline decoration-romantic-rose/30 underline-offset-8 font-light relative z-10 mt-5"
            >
              “...but I started caring more than I should have.”
            </motion.p>
          </div>

          <motion.div variants={revealLineVariant} className="mt-12">
            <button
              id="continue-button-realization"
              onClick={() => handleScrollTo("confession")}
              className="p-2 rounded-full border border-white/10 hover:border-romantic-blush/30 hover:bg-romantic-rose/10 transition-all cursor-pointer group"
              aria-label="Scroll to next segment"
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-romantic-blush" />
            </button>
          </motion.div>
        </StorySection>


        {/* SECTION 4: CONFESSION (MAIN CORE) */}
        <StorySection id="confession">
          <ConfessionCore />

          <motion.div variants={revealLineVariant} className="mt-16">
            <button
              id="continue-button-confession"
              onClick={() => handleScrollTo("personal-touch")}
              className="p-2 rounded-full border border-white/10 hover:border-romantic-rose/30 hover:bg-romantic-rose/10 transition-all cursor-pointer group"
              aria-label="Scroll to next segment"
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-romantic-blush" />
            </button>
          </motion.div>
        </StorySection>


        {/* SECTION 5: PERSONAL TOUCH */}
        <StorySection id="personal-touch">
          <PersonalTouch />

          <motion.div variants={revealLineVariant} className="mt-12">
            <button
              id="continue-button-personal"
              onClick={() => handleScrollTo("transition")}
              className="p-2 rounded-full border border-white/10 hover:border-romantic-gold/30 hover:bg-romantic-gold/10 transition-all cursor-pointer group"
              aria-label="Scroll to next segment"
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-romantic-gold" />
            </button>
          </motion.div>
        </StorySection>


        {/* SECTION 6: TRANSITION */}
        <StorySection id="transition">
          <motion.p 
            variants={revealLineVariant}
            className="font-serif text-xl md:text-2xl leading-relaxed text-white/60 font-light"
          >
            “I don’t know what the future looks like yet…”
          </motion.p>
          
          <motion.p 
            variants={revealLineVariant}
            className="font-serif text-3xl md:text-4.5xl leading-relaxed text-romantic-gold font-normal tracking-wide mt-5"
          >
            “But I know I want you in it.”
          </motion.p>

          <motion.div variants={revealLineVariant} className="mt-12">
            <button
              id="continue-button-transition"
              onClick={() => handleScrollTo("proposal")}
              className="p-2 rounded-full border border-white/10 hover:border-romantic-gold/30 hover:bg-romantic-gold/10 transition-all cursor-pointer group"
              aria-label="Scroll to next segment"
            >
              <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-romantic-gold" />
            </button>
          </motion.div>
        </StorySection>


        {/* SECTION 7: FINAL PROPOSAL */}
        <StorySection id="proposal" className="pb-36">
          <ProposalCard />
        </StorySection>

      </main>

      {/* Elegant minimalist footer */}
      <footer className="w-full absolute bottom-8 left-0 text-center z-20 px-6">
        <p className="text-xs font-mono text-white/30 tracking-[0.2em] flex items-center justify-center gap-1.5 uppercase">
          Made with honesty
          <Heart className="w-3 h-3 text-romantic-rose/60 fill-romantic-rose/10" />
        </p>
      </footer>
    </div>
  );
}

