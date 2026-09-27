import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Users, ChefHat, Sparkles, BookOpen, ShieldAlert, Award, Flame } from 'lucide-react';
import { GROUPS_LIST } from '../data/cookingData';
import { sfx } from '../utils/audio';

interface StartScreenProps {
  onStartGame: (group: string) => void;
  savedGroup: string | null;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, savedGroup }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(savedGroup || GROUPS_LIST[0]);
  const [customGroup, setCustomGroup] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const handleStart = () => {
    const finalGroup = isCustom && customGroup.trim() ? customGroup.trim() : selectedGroup;
    sfx.playFanfare();
    onStartGame(finalGroup);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center p-2 sm:p-4 text-stone-800 relative">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl w-full bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white border-4 border-amber-400/70 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10"
      >
        {/* Top Tag */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#450a0a]/90 border border-orange-400/50 text-amber-200 text-xs sm:text-sm font-bold shadow-inner">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>중학교 기술·가정 식생활 단원 교육용 레이드</span>
          </div>
        </div>

        {/* Hero Visual: Maratang Bowl Illustration */}
        <div className="relative my-4 flex justify-center">
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Steam animation */}
            <motion.div
              animate={{ opacity: [0.3, 0.9, 0.3], y: [-5, -15, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
            >
              ♨️♨️
            </motion.div>
            
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#dc2626] via-[#ea580c] to-[#f59e0b] flex items-center justify-center text-6xl shadow-2xl shadow-orange-950/60 border-4 border-amber-300">
              🍲
            </div>
            
            <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white p-2.5 rounded-2xl shadow-xl border-2 border-amber-300 text-xl">
              🔍
            </span>
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl sm:text-6xl font-black font-game tracking-tight text-white drop-shadow-md italic">
            마라탕 조리법 레이드
          </h1>
          <p className="text-lg sm:text-2xl text-amber-200 font-bold font-game">
            "마라탕 완성 사진을 관찰하고 <span className="text-orange-300 underline decoration-wavy underline-offset-4 font-black">숨은 조리법을 찾아라!</span>"
          </p>
          <p className="text-orange-100/90 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed pt-1">
            완성 사진을 꼼꼼히 관찰하여 사용된 조리법을 스스로 유추하고,
            생조리와 가열조리의 과학적 원리를 이해하여 완벽한 조리 순서를 재구성하세요!
          </p>
        </div>

        {/* Group Selection Section */}
        <div className="bg-[#450a0a]/80 border-2 border-orange-500/40 rounded-2xl p-5 mb-8 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-bold text-amber-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              참여할 모둠을 선택하세요:
            </h3>
            <span className="text-xs text-orange-300/80">모둠원과 협동하여 해결</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
            {GROUPS_LIST.map((group) => {
              const isSelected = !isCustom && selectedGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => {
                    sfx.playClick();
                    setIsCustom(false);
                    setSelectedGroup(group);
                  }}
                  className={`py-3 px-3 rounded-xl font-bold font-game text-sm sm:text-base transition-all border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] border-amber-300 text-white shadow-[0_4px_0_#450a0a] scale-105 ring-2 ring-amber-300'
                      : 'bg-[#5e1212] border-orange-500/40 text-orange-100 hover:bg-[#731919] hover:text-white'
                  }`}
                >
                  {group}
                </button>
              );
            })}
          </div>

          {/* Custom group name input option */}
          <div className="pt-2 border-t border-orange-500/30 flex items-center gap-2">
            <input
              type="text"
              placeholder="직접 모둠 이름 입력 (예: 마라탐정단)"
              value={customGroup}
              onChange={(e) => {
                setCustomGroup(e.target.value);
                setIsCustom(true);
              }}
              onFocus={() => setIsCustom(true)}
              className="flex-1 bg-[#5e1212] border border-orange-400/50 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-orange-300/50 focus:outline-none focus:border-amber-300"
            />
            {isCustom && customGroup.trim() && (
              <span className="text-xs text-amber-300 font-bold whitespace-nowrap">
                ✓ 선택됨
              </span>
            )}
          </div>
        </div>

        {/* Raid Overview Mini-cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8 text-center text-xs">
          <div className="bg-[#450a0a]/80 border border-orange-500/40 p-2.5 rounded-xl shadow-inner">
            <span className="text-amber-300 font-bold block font-game">MISSION 1</span>
            <span className="text-orange-200 text-[11px]">사진 관찰 & 조리법 유추</span>
          </div>
          <div className="bg-[#450a0a]/80 border border-orange-500/40 p-2.5 rounded-xl shadow-inner">
            <span className="text-amber-300 font-bold block font-game">MISSION 2</span>
            <span className="text-orange-200 text-[11px]">카드 뽑기 & 조리과학</span>
          </div>
          <div className="bg-[#450a0a]/80 border border-orange-500/40 p-2.5 rounded-xl shadow-inner">
            <span className="text-amber-300 font-bold block font-game">MISSION 3</span>
            <span className="text-orange-200 text-[11px]">8단계 조리 순서 재구성</span>
          </div>
        </div>

        {/* Start Raid Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full py-4 sm:py-5 bg-gradient-to-r from-[#ea580c] via-[#dc2626] to-[#b91c1c] hover:from-[#c2410c] hover:to-[#991b1b] text-white rounded-2xl font-game font-black text-xl sm:text-2xl shadow-[0_5px_0_#450a0a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition-all border-t border-amber-300 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>
            {isCustom && customGroup.trim() ? `[${customGroup}]` : `[${selectedGroup}]`} 레이드 작전 시작!
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};
