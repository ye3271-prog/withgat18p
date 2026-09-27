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
  Printer
} from 'lucide-react';
import { COOKING_METHODS_DATA } from '../data/cookingData';
import { sfx } from '../utils/audio';

interface ResultScreenProps {
  groupName: string;
  score: number;
  onRestart: () => void;
  onOpenTeacherMode: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  groupName,
  score,
  onRestart,
  onOpenTeacherMode,
}) => {
  const discoveredMethods = COOKING_METHODS_DATA.filter((m) => m.isCorrect);

  const handlePrint = () => {
    sfx.playClick();
    window.print();
  };

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-[#c2410c] font-black text-xs sm:text-sm font-game mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#ea580c]" />
          <span>기술·가정 조리 탐정 레이드 완수</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight italic">
          🔥 RAID COMPLETE 🔥
        </h2>

        <p className="text-[#ea580c] font-bold text-lg sm:text-2xl font-game mb-6">
          "마라탕 속 조리방법을 모두 찾아냈습니다!"
        </p>

        {/* Group & Score Badge Box */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-8">
          <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl">
            <span className="text-xs text-orange-800 font-bold block mb-0.5">활동 모둠</span>
            <span className="text-xl sm:text-2xl font-black text-[#7f1d1d] font-game">{groupName}</span>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
            <span className="text-xs text-amber-800 font-bold block mb-0.5">최종 획득 점수</span>
            <span className="text-xl sm:text-2xl font-black text-[#dc2626] font-game">{score} / 300 pt</span>
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
