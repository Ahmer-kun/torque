import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingMp3, setIsPlayingMp3] = useState(false);
  
  // Custom HTMLAudioElement for user uploaded music
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    gainNode: GainNode | null;
    delayNode: DelayNode | null;
    filterNode: BiquadFilterNode | null;
  }>({ gainNode: null, delayNode: null, filterNode: null });
  
  const timerRef = useRef<number | null>(null);

  // Simple beautiful chord progression:
  // Fmaj9 -> Cmaj9 -> Am9 -> G6 (romantic, nostalgic, warm, gentle)
  const chords = [
    [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9 (F3, A3, C4, E4, G4)
    [130.81, 196.00, 261.63, 311.13, 329.63], // Cmaj9 (C3, G3, C4, D#4/E4)
    [110.00, 164.81, 220.00, 261.63, 329.63], // Am9 (A2, E3, A3, C4, E4)
    [196.00, 246.94, 293.66, 392.00, 440.00], // G6/9 (G3, B3, D4, G4, A4)
  ];

  const currentChordIdx = useRef(0);

  // Initialize background MP3 loader and auto-play on load or first interaction
  useEffect(() => {
    // Try setting up standard MP3 file relative from root (e.g. /music.mp3)
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.35; // Beautiful ambient volume
    audioRef.current = audio;

    const triggerStart = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsPlayingMp3(true);
          removeInteractionListeners();
        } catch (err) {
          // If custom MP3 fails or is blocked, try starting procedural synthesis fallback
          try {
            startSynthesis();
            setIsPlaying(true);
            setIsPlayingMp3(false);
            removeInteractionListeners();
          } catch (e) {
            // Both sound sources blocked by general autoplay policy - will play on first click/touch
          }
        }
      }
    };

    const handleFirstInteraction = () => {
      triggerStart();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    // Attempt immediate autoplay
    triggerStart();

    // Setup fallback interaction hooks
    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      audio.pause();
      removeInteractionListeners();
    };
  }, []);

  const startSynthesis = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Safe lazy initialization of Web Audio nodes
      if (!nodesRef.current.gainNode) {
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0, ctx.currentTime);
        // Master Volume level is extremely gentle
        mainGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);

        // Low pass filter to make it deeply warm, cinematic, and non-harsh
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);

        // Delay effect to give space and reverb illusion
        const delay = ctx.createDelay(2.0);
        const delayGain = ctx.createGain();
        delay.delayTime.setValueAtTime(0.6, ctx.currentTime);
        delayGain.gain.setValueAtTime(0.35, ctx.currentTime); // feedback volume

        // Connect delay loop
        delay.connect(delayGain);
        delayGain.connect(delay); // loop back

        // Connections
        // Oscillator -> Filter -> Delay -> Main Gain -> Destination
        // Also Filter -> Main Gain -> Destination (dry mix)
        filter.connect(mainGain);
        filter.connect(delay);
        delay.connect(mainGain);
        mainGain.connect(ctx.destination);

        nodesRef.current.gainNode = mainGain;
        nodesRef.current.filterNode = filter;
        nodesRef.current.delayNode = delay;

        // Start our ambient note generator loop
        scheduleNextNotes();
      } else {
        // Fade in
        nodesRef.current.gainNode.gain.cancelScheduledValues(ctx.currentTime);
        nodesRef.current.gainNode.gain.setValueAtTime(nodesRef.current.gainNode.gain.value, ctx.currentTime);
        nodesRef.current.gainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5);
      }
    } catch (e) {
      console.error("Failed to start atmospheric audio:", e);
    }
  };

  const stopSynthesis = () => {
    const ctx = audioCtxRef.current;
    const gainNode = nodesRef.current.gainNode;
    if (ctx && gainNode) {
      gainNode.gain.cancelScheduledValues(ctx.currentTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
      // Fade out slowly
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
    }
  };

  // Play custom soft synth tone notes over time
  const scheduleNextNotes = () => {
    const ctx = audioCtxRef.current;
    const filter = nodesRef.current.filterNode;
    if (!ctx || !filter || ctx.state === "closed") return;

    const time = ctx.currentTime;
    const chord = chords[currentChordIdx.current];

    // Play 3 to 4 notes from the current chord sequentially for a beautiful ambient texture
    chord.forEach((freq, index) => {
      // Soft staggered delay to sound like a gentle strum or slow arpeggio
      const noteDelay = index * 0.75 + Math.random() * 0.2;
      const noteStartTime = time + noteDelay;
      
      const osc = ctx.createOscillator();
      // Triangle wave provides a beautiful, warm flute-like wooden chime sound
      osc.type = Math.random() > 0.4 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, noteStartTime);

      // Fine-tuned detuning for slow romantic analog chorus effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, noteStartTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, noteStartTime);
      // Soft fade in of the note to keep it gentle
      oscGain.gain.linearRampToValueAtTime(0.08, noteStartTime + 1.2);
      // Extremely long, slow romantic tail decay
      oscGain.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + 6.0);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(noteStartTime);
      osc.stop(noteStartTime + 6.5);
    });

    // Cue next chord
    currentChordIdx.current = (currentChordIdx.current + 1) % chords.length;

    // Schedule next cycle (every 6 seconds for beautiful atmospheric slow-paced overlap)
    timerRef.current = window.setTimeout(scheduleNextNotes, 6200);
  };

  const handleToggle = async () => {
    if (isPlaying) {
      if (isPlayingMp3 && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSynthesis();
      }
      setIsPlaying(false);
      setIsPlayingMp3(false);
    } else {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsPlayingMp3(true);
        } catch (err) {
          console.log("No custom /music.mp3 found or allowed by browser. Defaulting to procedural synthesis.", err);
          startSynthesis();
          setIsPlaying(true);
          setIsPlayingMp3(false);
        }
      } else {
        startSynthesis();
        setIsPlaying(true);
        setIsPlayingMp3(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Light pulse indicators of active music */}
      {isPlaying && (
        <span className="text-xs font-mono text-romantic-gold/80 flex items-center gap-1.5 bg-romantic-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-romantic-gold/10 shadow-lg">
          <Music className="w-3 h-3 text-romantic-gold animate-pulse" />
          <span className="tracking-wider">
            {isPlayingMp3 ? "Custom Soundtrack" : "Ambient Loop"}
          </span>
        </span>
      )}
      
      <button
        id="audio-player-button"
        onClick={handleToggle}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border ${
          isPlaying
            ? "bg-romantic-gold/15 border-romantic-gold/30 text-white shadow-[0_0_15px_rgba(207,161,74,0.3)] hover:scale-105"
            : "bg-romantic-black/80 border-white/10 text-white/65 hover:text-white hover:border-white/30 hover:scale-105"
        } cursor-pointer`}
        aria-label={isPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
        title={isPlaying ? "Mute Ambient Soundtrack" : "Play Ambient Soundtrack"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-romantic-gold animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-white/50" />
        )}
      </button>
    </div>
  );
}
