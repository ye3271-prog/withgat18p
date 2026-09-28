import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Flame, 
  Droplets, 
  ChefHat,
  MessageCircleQuestion,
  Printer,
  Zap,
  Clock,
  Users
} from 'lucide-react';
import { COOKING_METHODS_DATA } from '../data/cookingData';
import { sfx } from '../utils/audio';

interface ResultScreenProps {
  groupName: string;
  score: number;
  speedBonus?: number;
  totalTimeSeconds?: number;
  onRestart: () => void;
  onOpenTeacherMode: () => void;
  onOpenLiveDashboard?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  groupName,
  score,
  speedBonus = 0,
  totalTimeSeconds = 0,
  onRestart,
  onOpenTeacherMode,
  onOpenLiveDashboard,
}) => {
  const discoveredMethods = COOKING_METHODS_DATA.filter((m) => m.isCorrect);

  const handlePrint = () => {
    sfx.playClick();
    window.print();
  };

  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  // Title rank evaluation
  let titleBadge = '🍲 꼼꼼한 마라 탐정 (B랭크)';
  let titleBg = 'bg-stone-100 text-stone-800 border-stone-300';
  if (score >= 400) {
    titleBadge = '⚡ 전설의 광속 마라 셰프 (S랭크)';
    titleBg = 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-400 shadow-md font-black animate-pulse';
  } else if (score >= 340) {
    titleBadge = '🔥 열혈 조리 과학자 (A랭크)';
    titleBg = 'bg-gradient-to-r from-orange-400 to-amber-300 text-orange-950 border-orange-300 shadow-sm font-black';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      
      {/* Main Certificate / Raid Complete Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden"
      >
        {/* Decorative ambient top glow */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b]" />
        
        {/* Trophy icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#ea580c] to-[#dc2626] flex items-center justify-center text-white shadow-xl shadow-orange-500/30 border-2 border-amber-300"
        >
          <Trophy className="w-14 h-14 text-white" />
        </motion.div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-[#c2410c] font-black text-xs sm:text-sm font-game shadow-xs">
            <Sparkles className="w-4 h-4 text-[#ea580c]" />
            <span>기술·가정 조리 탐정 레이드 완수</span>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs sm:text-sm font-game ${titleBg}`}>
            <span>{titleBadge}</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight italic">
          🔥 RAID COMPLETE 🔥
        </h2>

        <p className="text-[#ea580c] font-bold text-lg sm:text-2xl font-game mb-6">
          "마라탕 속 조리방법을 모두 찾아냈습니다!"
        </p>

        {/* Group & Score Badge Box with Speed Bonus */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
          <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl">
            <span className="text-xs text-orange-800 font-bold block mb-0.5">활동 모둠</span>
            <span className="text-xl sm:text-2xl font-black text-[#7f1d1d] font-game">{groupName}</span>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl relative overflow-hidden">
            <span className="text-xs text-amber-800 font-bold block mb-0.5">최종 획득 점수</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#dc2626] font-game">{score}</span>
              <span className="text-xs text-stone-500 font-normal">/ 450 pt</span>
            </div>
            {speedBonus > 0 && (
              <span className="text-[11px] text-amber-700 font-black mt-1 inline-flex items-center gap-0.5 bg-amber-200/80 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-amber-600 text-amber-600" />
                스피드 보너스 +{speedBonus}pt 포함
              </span>
            )}
          </div>

          <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-2xl">
            <span className="text-xs text-stone-600 font-bold block mb-0.5">총 소요 시간</span>
            <span className="text-xl sm:text-2xl font-black text-stone-800 font-game">
              {minutes > 0 ? `${minutes}분 ` : ''}{seconds}초
            </span>
          </div>
        </div>

        {/* 3 Core Cooking Methods Synthesis */}
        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-center font-black text-stone-900 text-base sm:text-lg font-game mb-4 flex items-center justify-center gap-2">
            <span>[우리가 마라탕에서 찾아낸 3대 조리방법]</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discoveredMethods.map((m) => (
              <div
                key={m.id}
                className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{m.name}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        m.category === '생조리' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {m.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {m.effect}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-orange-100 text-[10px] text-[#ea580c] font-bold">
                  <strong>마라탕 역할:</strong> {m.maratangUsage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Reflective Discussion Questions */}
        <div className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white rounded-2xl p-6 sm:p-8 text-left space-y-4 mb-8 shadow-xl border-2 border-orange-500/60">
          <div className="flex items-center gap-2 text-amber-300 font-black font-game text-base sm:text-lg">
            <MessageCircleQuestion className="w-6 h-6 text-amber-300" />
            <span>수업 마무리 성찰 토의 (모둠 나눔 활동)</span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-orange-100">
            <div className="bg-[#450a0a]/80 p-3.5 rounded-xl border border-orange-500/30 shadow-inner">
              <strong className="text-amber-300 font-bold block mb-1">
                Q1. "하나의 음식에도 여러 가지 조리방법이 숨어 있다는 것을 발견했나요?"
              </strong>
              <p className="text-orange-100 text-xs leading-relaxed">
                마라탕은 단순히 '끓이기만 하는 음식'이 아니라, 재료의 흡수를 돕는 [불리기], 풍미를 극대화하는 [볶기], 고르게 익히는 [끓이기]가 체계적으로 결합된 복합 조리 요리입니다.
              </p>
            </div>

            <div className="bg-[#450a0a]/80 p-3.5 rounded-xl border border-orange-500/30 shadow-inner">
              <strong className="text-amber-300 font-bold block mb-1">
                Q2. "내가 자주 먹는 다른 요리(예: 라면, 김치찌개, 떡볶이, 파스타)에는 어떤 조리방법들이 숨어 있을까요?"
              </strong>
              <p className="text-orange-100 text-xs leading-relaxed">
                재료 손질(생조리)부터 재료 볶기, 육수 끓이기, 뜸들이기 등 다양한 조리법의 유기적 결합을 찾아보세요!
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-5 py-3 rounded-2xl transition text-sm font-game cursor-pointer border border-stone-300"
          >
            <Printer className="w-4 h-4" />
            <span>결과지 인쇄 / PDF 저장</span>
          </button>

          {onOpenLiveDashboard && (
            <button
              onClick={() => {
                sfx.playClick();
                onOpenLiveDashboard();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-[#ea580c] hover:from-amber-600 hover:to-[#c2410c] text-white font-black px-6 py-3 rounded-2xl transition text-sm font-game shadow-[0_4px_0_#9a3412] active:translate-y-1 active:shadow-none cursor-pointer border border-amber-300"
            >
              <Users className="w-4 h-4 text-white" />
              <span>전체 모둠 실시간 랭킹 보기</span>
            </button>
          )}

          <button
            onClick={() => {
              sfx.playClick();
              onRestart();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white font-bold px-6 py-3 rounded-2xl transition text-sm font-game shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none cursor-pointer border border-amber-300/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>처음부터 다시 도전하기</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
