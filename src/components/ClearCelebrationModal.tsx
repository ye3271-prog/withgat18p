import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowRight, Star, Flame, X, Zap, Clock } from 'lucide-react';
import { sfx } from '../utils/audio';

interface ClearCelebrationModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  badgeText: string;
  pointsEarned: number;
  speedBonusEarned?: number;
  timeSeconds?: number;
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
  speedBonusEarned = 0,
  timeSeconds,
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
          <div className="space-y-2.5 mb-6 text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-3 flex items-center justify-between px-4 sm:px-5"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#ea580c] fill-[#ea580c]" />
                <span className="text-stone-800 font-bold text-xs sm:text-sm">기본 클리어 점수</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-[#dc2626] font-game">
                +{pointsEarned} pt
              </span>
            </motion.div>

            {speedBonusEarned !== undefined && speedBonusEarned > 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 5 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-500/15 via-yellow-400/25 to-amber-500/15 border-2 border-amber-400 rounded-2xl p-3 flex items-center justify-between px-4 sm:px-5 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-500 text-white animate-bounce shrink-0">
                    <Zap className="w-4 h-4 fill-white" />
                  </span>
                  <div>
                    <span className="text-amber-950 font-black text-xs sm:text-sm block">⚡ 광속 스피드 보너스!</span>
                    {timeSeconds !== undefined && (
                      <span className="text-[11px] text-amber-800 font-medium block">
                        ⏱️ 미션 완료 소요 시간: {timeSeconds}초
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-black text-amber-600 font-game animate-pulse shrink-0">
                  +{speedBonusEarned} pt
                </span>
              </motion.div>
            ) : timeSeconds !== undefined ? (
              <div className="text-[11px] text-stone-500 text-center flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>미션 소요 시간: {timeSeconds}초 (다음 미션에선 더 빠르게 도전해 보세요!)</span>
              </div>
            ) : null}

            <div className="pt-1 flex items-center justify-between px-2 text-xs font-bold text-stone-700">
              <span>이번 미션 총 획득:</span>
              <span className="text-lg sm:text-xl font-black text-[#ea580c] font-game">
                +{pointsEarned + (speedBonusEarned || 0)} pt
              </span>
            </div>
          </div>

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
