import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChefHat, Flame, Droplets, Sparkles, Check, Info, Volume2, Lock, Eye } from 'lucide-react';
import { RECIPE_STEPS_DATA } from '../data/cookingData';
import { sfx } from '../utils/audio';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMission1Mode?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ 
  isOpen, 
  onClose,
  isMission1Mode = false
}) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (!isOpen) return null;

  // Clue mode descriptions that do NOT spoil the exact cooking method keywords
  const clueDescriptions: Record<number, { title: string; badge: string; text: string; photoQuestion: string }> = {
    1: {
      title: '건조 식재료(당면 & 푸주) 사전 작업',
      badge: '💧 수분 흡수 단계 [?]',
      text: '딱딱하게 말라있는 중국당면과 푸주를 찬물에 약 2시간 담가두는 전처리 단계입니다.',
      photoQuestion: '사진 속 투명하고 쫄깃하게 풀린 당면과 부드러운 푸주는 가열 전 어떤 생조리 방법을 거쳤을까요?'
    },
    2: {
      title: '식용유와 향신 채소(대파·마늘) 향미 추출',
      badge: '🔥 기름 향미 추출 단계 [?]',
      text: '달군 냄비에 기름을 넉넉히 두르고 대파와 다진 마늘을 센 불에 달달 익혀 파기름을 만듭니다.',
      photoQuestion: '사진 속 국물 표면에 은은하게 뜬 붉은 기름막과 얼얼하고 고소한 향은 어떤 조리법으로 만들었을까요?'
    },
    3: {
      title: '사골 육수와 마라소스 100℃ 가열',
      badge: '🍲 국물 대류 가열 [?]',
      text: '사골국물 800mL + 물 700mL + 마라소스 + 푸주를 넣고 센 불에서 100℃로 가열합니다.',
      photoQuestion: '사진 속 넉넉한 국물 속에서 재료들이 부드럽게 익어있는 것은 어떤 조리법 덕분일까요?'
    },
    4: {
      title: '신선한 채소 투입 및 가열',
      badge: '🍲 국물 대류 가열 [?]',
      text: '국물이 끓어오르면 청경채, 알배기 배추, 숙주나물, 버섯 등을 넣고 익힙니다.',
      photoQuestion: '채소가 국물과 함께 푹 익어 채수가 우러나도록 한 조리법은 무엇일까요?'
    },
    5: {
      title: '전처리된 당면과 부재료 익힘',
      badge: '🍲 국물 대류 가열 [?]',
      text: '불린 당면, 분모자, 비엔나 소시지, 어묵을 넣고 국물과 함께 골고루 익힙니다.',
      photoQuestion: '다양한 재료들이 뜨거운 액체 열을 받아 고루 익도록 하는 조리법을 생각해 보세요.'
    },
    6: {
      title: '얇게 썬 소고기 익힘',
      badge: '🍲 국물 대류 가열 [?]',
      text: '얇게 썬 소고기를 넣어 질겨지지 않도록 부드럽게 익힙니다.',
      photoQuestion: '고기가 육수의 열로 익어 단백질이 응고되는 조리 과정을 연결지어 보세요.'
    },
    7: {
      title: '옥수수면·면사리 넣기 및 최종 가열',
      badge: '🍲 국물 대류 가열 [?]',
      text: '면발이 붇지 않고 꼬들꼬들하도록 마지막 순서에 넣어 익힙니다.',
      photoQuestion: '옥수수면이나 면사리를 100℃ 국물 속에서 쫄깃하게 익혀내는 조리방법은 무엇일까요?'
    },
    8: {
      title: '완성된 마라탕 큰 그릇에 담아내기',
      badge: '✨ 플레이팅/완성',
      text: '완성된 마라탕을 큰 그릇에 정갈하고 먹음직스럽게 담아냅니다.',
      photoQuestion: '완성된 요리를 먹기 좋게 그릇에 담아내는 마지막 단계입니다.'
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-orange-500 overflow-hidden my-auto"
        >
          {/* Modal Header in Warm Spicy Malatang Red */}
          <div className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-orange-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#dc2626] flex items-center justify-center shadow-lg border border-amber-300">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-game flex items-center gap-2">
                  {isMission1Mode ? '마라탕 주방 조리 일지 (단서 모드)' : '마라탕 표준 레시피 수사 기록'}
                  <span className="text-xs bg-orange-600 text-white font-sans px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                    8단계 조리 분석
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-orange-200">
                  {isMission1Mode 
                    ? '완성 사진과 대조하며 어떤 조리방법이 쓰였는지 스스로 유추해 보세요!' 
                    : '각 조리 과정에 적용된 생조리와 가열조리의 과학적 원리를 확인하세요.'}
                </p>
              </div>
            </div>

            <button
              id="recipe-close-btn"
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#521111] hover:bg-[#6e1818] text-orange-200 hover:text-white transition shadow-sm border border-orange-500/50 cursor-pointer"
              title="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body - 8 Steps */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-3 bg-[#fffaf5]">
            {isMission1Mode ? (
              <div className="bg-amber-100/80 border-l-4 border-[#ea580c] p-3.5 rounded-r-xl text-amber-950 text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
                <Lock className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#7f1d1d]">[레시피 명칭 블라인드 모드]:</strong>{' '}
                  1단계에서는 조리방법 명칭이 노출되지 않도록 가려져 있습니다!{' '}
                  <strong>완성된 마라탕 사진</strong>을 유심히 관찰하여 사용된 조리방법 3가지를 스스로 추리해 내야 합니다.
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3.5 rounded-r-xl text-orange-950 text-xs sm:text-sm flex items-start gap-2.5 shadow-xs">
                <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-[#7f1d1d]">표준 레시피 전체 열람:</strong>{' '}
                  8단계 조리 순서와 각 단계에 적용된 생조리·가열조리 원리입니다. 각 번호 카드를 클릭하면 상세한 조리 팁을 확인할 수 있습니다.
                </div>
              </div>
            )}

            <div className="grid gap-2.5">
              {RECIPE_STEPS_DATA.map((step) => {
                const isSelected = activeStep === step.stepNumber;
                const clue = clueDescriptions[step.stepNumber];
                const displayTitle = isMission1Mode && clue ? clue.title : step.title;
                const displayText = isMission1Mode && clue ? clue.text : step.fullText;

                return (
                  <motion.div
                    key={step.stepNumber}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      if (step.cookingMethod === '볶기') {
                        sfx.playSizzle();
                      } else if (step.cookingMethod === '끓이기') {
                        sfx.playBoil();
                      } else {
                        sfx.playClick();
                      }
                      setActiveStep(isSelected ? null : step.stepNumber);
                    }}
                    className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 transition-all border-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-[#ea580c] shadow-md ring-2 ring-orange-300'
                        : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Step Number Badge */}
                      <span className={`w-8 h-8 rounded-xl font-game font-bold flex items-center justify-center shrink-0 text-sm shadow-sm ${
                        isSelected 
                          ? 'bg-[#ea580c] text-white' 
                          : 'bg-orange-100 text-orange-900 border border-orange-200'
                      }`}>
                        {step.stepNumber}
                      </span>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                            {displayTitle}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            {/* Audio clues */}
                            {step.cookingMethod === '볶기' && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sfx.playSizzle();
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 text-[10px] font-bold shadow-xs transition"
                                title="지글거리는 조리 소리 듣기"
                              >
                                <Volume2 className="w-3 h-3 text-[#ea580c] animate-pulse" />
                                <span>소리 단서</span>
                              </span>
                            )}
                            {step.cookingMethod === '끓이기' && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sfx.playBoil();
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold shadow-xs transition"
                                title="보글보글 조리 소리 듣기"
                              >
                                <Volume2 className="w-3 h-3 text-[#ea580c] animate-pulse" />
                                <span>소리 단서</span>
                              </span>
                            )}

                            {isMission1Mode && clue ? (
                              <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Eye className="w-3 h-3 text-[#ea580c]" />
                                {clue.badge}
                              </span>
                            ) : (
                              <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                                step.category === '생조리' 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {step.category} ({step.cookingMethod})
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                          {displayText}
                        </p>

                        {/* Expanded details when clicked */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-orange-200 text-xs space-y-1.5 text-stone-800 bg-white/90 p-3 rounded-xl shadow-xs"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#b91c1c]">주요 식재료:</span>
                                <span className="text-stone-700">{step.ingredient}</span>
                              </div>
                              <div className="flex items-start gap-1.5">
                                <span className="font-bold text-[#b91c1c] shrink-0">
                                  {isMission1Mode ? '사진 관찰 유추 질문:' : '조리 과학 포인트:'}
                                </span>
                                <span className="text-stone-700">
                                  {isMission1Mode && clue ? clue.photoQuestion : step.tip}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white font-bold px-8 py-3 rounded-2xl transition shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none text-sm sm:text-base font-game cursor-pointer border border-amber-300/40"
            >
              확인 완료 (미션으로 돌아가기)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
