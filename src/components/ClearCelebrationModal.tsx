import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, Star, Flame, X } from 'lucide-react';
import { sfx } from '../utils/audio';

interface ClearCelebrationModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  pointsEarned: number;
  onNext: () => void;
  nextButtonText: string;
  icon?: React.ReactNode;
}

export const ClearCelebrationModal: React.FC<ClearCelebrationModalProps> = ({
  isOpen,
  title,
  subtitle,
  badgeText,
  pointsEarned,
  onNext,
  nextButtonText,
  icon,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={() => {
          sfx.playClick();
          onNext();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md cursor-pointer"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-white rounded-3xl shadow-2xl border-4 border-amber-400 p-6 sm:p-8 text-center overflow-hidden cursor-default"
        >
          {/* Top-Right Quick Close Button */}
          <button
            onClick={() => {
              sfx.playClick();
              onNext();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition border border-stone-300 cursor-pointer z-10"
            title="닫고 다음으로 이동"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative Background Rays */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-200/50 rounded-full blur-2xl pointer-events-none" />

          {/* Top Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md mb-4 font-game border border-amber-300"
          >
            <Sparkles className="w-4 h-4 text-amber-200" /> {badgeText}
          </motion.div>

          {/* Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#ea580c] to-[#dc2626] flex items-center justify-center text-white shadow-xl shadow-orange-500/30 border-2 border-amber-300"
          >
            {icon || <Trophy className="w-14 h-14 text-white animate-pulse" />}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight italic"
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-stone-600 text-sm sm:text-base mb-6 leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Points Earned Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-3.5 mb-6 flex items-center justify-center gap-3"
          >
            <Star className="w-6 h-6 text-[#ea580c] fill-[#ea580c] animate-spin" />
            <span className="text-stone-800 font-bold text-sm sm:text-base">
              레이드 보상 점수:
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#dc2626] font-game">
              +{pointsEarned} pt
            </span>
          </motion.div>

          {/* Next Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sfx.playClick();
              onNext();
            }}
            className="w-full bg-gradient-to-r from-[#ea580c] via-[#dc2626] to-[#b91c1c] hover:from-[#c2410c] hover:to-[#991b1b] text-white font-black text-lg sm:text-xl py-4 rounded-2xl shadow-[0_4px_0_#450a0a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 font-game transition border-t border-amber-300 cursor-pointer"
          >
            <span>{nextButtonText}</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
