import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronUp, 
  ChevronDown, 
  GripVertical, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChefHat, 
  Flame, 
  Droplets,
  RotateCcw,
  Check,
  Volume2
} from 'lucide-react';
import { RECIPE_STEPS_DATA } from '../data/cookingData';
import { RecipeStep } from '../types';
import { sfx } from '../utils/audio';

interface Mission3Props {
  onComplete: () => void;
  onOpenRecipe: () => void;
  isAlreadyCleared: boolean;
}

export const Mission3: React.FC<Mission3Props> = ({
  onComplete,
  onOpenRecipe,
  isAlreadyCleared
}) => {
  const standardSteps = RECIPE_STEPS_DATA;

  // Initialize shuffled steps
  const [steps, setSteps] = useState<RecipeStep[]>(() => {
    if (isAlreadyCleared) return [...standardSteps];
    const shuffled = [...standardSteps].sort(() => Math.random() - 0.5);
    if (shuffled.every((s, i) => s.stepNumber === i + 1)) {
      shuffled.reverse();
    }
    return shuffled;
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; correctCount: number } | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(isAlreadyCleared);

  // Move item using Up/Down buttons
  const moveStep = (index: number, direction: 'up' | 'down') => {
    const moved = steps[index];
    if (moved.cookingMethod === '볶기') {
      sfx.playSizzle();
    } else if (moved.cookingMethod === '끓이기') {
      sfx.playBoil();
    } else {
      sfx.playClick();
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    setSteps(newSteps);
    setFeedback(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    const item = steps[index];
    if (item.cookingMethod === '볶기') {
      sfx.playSizzle();
    } else if (item.cookingMethod === '끓이기') {
      sfx.playBoil();
    } else {
      sfx.playClick();
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSteps = [...steps];
    const draggedItem = newSteps.splice(draggedIndex, 1)[0];
    newSteps.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSteps(newSteps);
    setFeedback(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Reset to initial shuffle
  const handleResetOrder = () => {
    sfx.playClick();
    const shuffled = [...standardSteps].sort(() => Math.random() - 0.5);
    setSteps(shuffled);
    setFeedback(null);
    setIsSuccess(false);
  };

  // Check user answer
  const handleCheckAnswer = () => {
    const isAllCorrect = steps.every((step, index) => step.stepNumber === index + 1);
    const correctCount = steps.filter((step, index) => step.stepNumber === index + 1).length;

    if (isAllCorrect) {
      sfx.playFanfare();
      setIsSuccess(true);
      setFeedback({
        isCorrect: true,
        message: '🎊 완벽합니다! 마라탕의 8단계 조리 순서를 정확하게 재구성했습니다! RAID CLEAR! 🎊',
        correctCount: 8,
      });
    } else {
      sfx.playWrong();
      setFeedback({
        isCorrect: false,
        message: '조리 과정의 순서를 다시 생각해보세요. (불리기 → 파기름 볶기 → 국물 끓이기 순서를 점검해볼까요?)',
        correctCount: correctCount,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Mission Header - Warm Spicy Theme */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-orange-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b]" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#c2410c] text-xs font-black mb-3 font-game shadow-xs border border-orange-300/50">
          <Flame className="w-3.5 h-3.5 text-[#ea580c] animate-pulse" />
          <span>MISSION 3</span>
          <span>•</span>
          <span>최종 조리 순서 재구성</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight">
          「마라탕 조리 순서를 완성하라!」
        </h2>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          뒤섞인 마라탕 조리 과정 카드를 위아래 화살표(▲ / ▼)나 마우스 드래그를 이용해
          올바른 순서(1단계~8단계)로 정렬한 후 <strong>[정답 확인하기]</strong> 버튼을 누르세요.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => {
              sfx.playClick();
              onOpenRecipe();
            }}
            className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold px-4 py-2 rounded-xl transition text-xs sm:text-sm font-game border border-orange-300 cursor-pointer shadow-xs"
          >
            <ChefHat className="w-4 h-4 text-[#ea580c]" />
            <span>레시피 단서 다시 보기</span>
          </button>

          <button
            onClick={handleResetOrder}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3.5 py-2 rounded-xl transition text-xs sm:text-sm font-game cursor-pointer border border-stone-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>카드 다시 섞기</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 border shadow-md font-medium text-xs sm:text-sm ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold text-base'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.isCorrect ? (
                <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <p>{feedback.message}</p>
            </div>
            {!feedback.isCorrect && (
              <span className="text-xs font-bold bg-rose-200 text-rose-950 px-2.5 py-1 rounded-full whitespace-nowrap">
                일치 항목: {feedback.correctCount} / 8
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reorderable Step Cards List */}
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isDragging = draggedIndex === index;
          const isCorrectPosition = isSuccess && step.stepNumber === index + 1;

          return (
            <motion.div
              layout
              key={step.title}
              draggable={!isSuccess}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 transition-all bg-white select-none ${
                isDragging
                  ? 'opacity-40 border-[#ea580c] scale-95 shadow-inner'
                  : isCorrectPosition
                  ? 'border-[#ea580c] bg-gradient-to-r from-orange-50 to-amber-50 shadow-md ring-2 ring-[#ea580c]'
                  : 'border-stone-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              {/* Drag Handle Indicator */}
              <div className="text-stone-300 group-hover:text-[#ea580c] cursor-grab active:cursor-grabbing p-1">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Step Slot Number Badge */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-game font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm ${
                isSuccess
                  ? 'bg-gradient-to-tr from-[#ea580c] to-[#dc2626] text-white ring-2 ring-amber-300'
                  : 'bg-[#7f1d1d] text-white'
              }`}>
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                    {step.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                    step.category === '생조리' 
                      ? 'bg-sky-100 text-sky-800 border border-sky-200' 
                      : 'bg-orange-100 text-orange-800 border border-orange-200'
                  }`}>
                    {step.category} ({step.cookingMethod})
                  </span>

                  {/* Cooking Sound Audition Chip */}
                  {step.cookingMethod === '볶기' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sfx.playSizzle();
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 text-[10px] font-bold transition shadow-xs cursor-pointer"
                      title="지글지글 볶는 소리 듣기"
                    >
                      <Volume2 className="w-3 h-3 text-[#ea580c] animate-pulse" />
                      <span>지글지글</span>
                    </button>
                  )}

                  {step.cookingMethod === '끓이기' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sfx.playBoil();
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold transition shadow-xs cursor-pointer"
                      title="보글보글 끓는 소리 듣기"
                    >
                      <Volume2 className="w-3 h-3 text-[#ea580c] animate-pulse" />
                      <span>보글보글</span>
                    </button>
                  )}
                </div>
                <p className="text-stone-500 text-xs line-clamp-1">
                  {step.fullText}
                </p>
              </div>

              {/* Control Up / Down Buttons for Touch / Blackboard UX */}
              {!isSuccess && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-600 hover:text-orange-900 disabled:opacity-30 disabled:hover:bg-stone-100 transition shadow-sm cursor-pointer border border-stone-200"
                    title="위로 이동"
                  >
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-orange-100 text-stone-600 hover:text-orange-900 disabled:opacity-30 disabled:hover:bg-stone-100 transition shadow-sm cursor-pointer border border-stone-200"
                    title="아래로 이동"
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}

              {isSuccess && (
                <div className="p-1 text-[#ea580c]">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Action Check Order Button / Clear Transition */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {!isSuccess ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCheckAnswer}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white rounded-2xl font-black text-lg sm:text-xl font-game shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer border border-amber-300/40"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>정답 확인하기</span>
          </motion.button>
        ) : (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sfx.playFanfare();
              onComplete();
            }}
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#ea580c] via-[#dc2626] to-[#b91c1c] hover:from-[#c2410c] hover:to-[#991b1b] text-white rounded-2xl font-black text-xl sm:text-2xl font-game shadow-[0_5px_0_#450a0a] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer border border-amber-300"
          >
            <span>🔥 RAID COMPLETE 결과 확인하기 🔥</span>
          </motion.button>
        )}
      </div>

    </div>
  );
};
