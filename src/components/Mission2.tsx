import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Droplets, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  ChefHat, 
  BookOpen, 
  Lightbulb, 
  ArrowRight,
  Eye,
  EyeOff,
  Volume2
} from 'lucide-react';
import { COOKING_METHODS_DATA, THEORY_INFO } from '../data/cookingData';
import { CookingMethod } from '../types';
import { sfx } from '../utils/audio';

interface Mission2Props {
  onComplete: () => void;
  onOpenRecipe: () => void;
  isAlreadyCleared: boolean;
}

export const Mission2: React.FC<Mission2Props> = ({ 
  onComplete, 
  onOpenRecipe,
  isAlreadyCleared 
}) => {
  // Correct pool of methods from Mission 1
  const validMethods = COOKING_METHODS_DATA.filter((m) => m.isCorrect);

  // States
  const [isDrawn, setIsDrawn] = useState<boolean>(isAlreadyCleared);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod>(validMethods[1]); // Default to '볶기'

  // Student inputs
  const [answer1, setAnswer1] = useState<string>('');
  const [answer2, setAnswer2] = useState<string>('');
  const [answer3, setAnswer3] = useState<string>('');

  // Submitted & Model Answer view state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(isAlreadyCleared);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  // Draw card handler with 3D flip
  const handleDrawCard = () => {
    sfx.playFlip();
    setIsFlipping(true);

    setTimeout(() => {
      // Pick random among the 3
      const randomIndex = Math.floor(Math.random() * validMethods.length);
      const picked = validMethods[randomIndex];
      setSelectedMethod(picked);
      setIsDrawn(true);
      setIsFlipping(false);
      setIsSubmitted(false);
      setShowModelAnswer(false);

      if (picked.id === 'stir') {
        sfx.playSizzle();
      } else if (picked.id === 'boil') {
        sfx.playBoil();
      } else {
        sfx.playCorrect();
      }
    }, 600);
  };

  const handleQuickInsert = (field: 1 | 2 | 3, text: string) => {
    sfx.playClick();
    if (field === 1) setAnswer1((prev) => (prev ? `${prev} ${text}` : text));
    if (field === 2) setAnswer2((prev) => (prev ? `${prev} ${text}` : text));
    if (field === 3) setAnswer3((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleSubmitAnswers = (e: React.FormEvent) => {
    e.preventDefault();
    sfx.playFanfare();
    setIsSubmitted(true);
    if (!answer1) setAnswer1(`${selectedMethod.name}은(는) ${selectedMethod.category}에 속하며, ${selectedMethod.description}`);
    if (!answer2) setAnswer2(selectedMethod.maratangUsage);
    if (!answer3) setAnswer3(selectedMethod.effect);
    onComplete();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Mission Briefing Header - Warm Spicy Theme */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-orange-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b]" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#c2410c] text-xs font-black mb-3 font-game shadow-xs border border-orange-300/50">
          <Flame className="w-3.5 h-3.5 text-[#ea580c] animate-pulse" />
          <span>MISSION 2</span>
          <span>•</span>
          <span>조리과학 원리 탐구</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight">
          「조리방법의 과학적 비밀을 밝혀라!」
        </h2>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          MISSION 1에서 유추해 낸 조리방법 카드를 뽑고, 생조리와 가열조리의 특징을 비교하며
          마라탕 레시피 속 과학적 변화를 탐구해 보세요.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => {
              sfx.playClick();
              onOpenRecipe();
            }}
            className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-4 py-2 rounded-xl transition text-xs sm:text-sm font-game border border-orange-300 cursor-pointer shadow-xs"
          >
            <ChefHat className="w-4 h-4 text-[#ea580c]" />
            <span>마라탕 레시피 단서 확인하기</span>
          </button>

          <button
            onClick={() => {
              sfx.playFanfare();
              onComplete();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white font-black px-4.5 py-2 rounded-xl transition text-xs sm:text-sm font-game shadow-md border border-amber-300 cursor-pointer"
          >
            <span>3단계 미션(순서 재구성)으로 바로 가기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Drawing Section */}
      {!isDrawn ? (
        <div className="bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] rounded-3xl p-10 sm:p-14 text-center shadow-2xl border-4 border-amber-400/80 flex flex-col items-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🎴</div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-game mb-3">
            탐구할 조리방법 카드 뽑기
          </h3>
          <p className="text-orange-200 text-sm max-w-md mb-8 font-medium">
            버튼을 누르면 MISSION 1에서 유추한 [불리기, 볶기, 끓이기] 중 하나가 무작위로 선택됩니다!
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDrawCard}
            disabled={isFlipping}
            className="px-10 py-4.5 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white rounded-2xl font-black text-xl sm:text-2xl font-game shadow-[0_4px_0_#450a0a] active:translate-y-1 active:shadow-none transition border-t border-amber-300 flex items-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-amber-200" />
            <span>🎴 조리방법 카드 뽑기</span>
          </motion.button>

          <button
            type="button"
            onClick={() => {
              sfx.playFanfare();
              onComplete();
            }}
            className="mt-6 text-xs sm:text-sm text-orange-200 hover:text-white underline underline-offset-4 font-bold cursor-pointer transition flex items-center gap-1.5"
          >
            <span>3단계 미션(순서 재구성)으로 바로 넘어가기 →</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Drawn Card Showcase in Spicy Red */}
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-3xl bg-[#450a0a]/90 border-2 border-amber-300 flex items-center justify-center text-6xl shadow-inner shrink-0">
                {selectedMethod.icon}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white font-black text-xs font-game mb-2 shadow-sm border border-amber-300/40">
                  <span>우리가 뽑은 탐구 카드</span>
                  <span>•</span>
                  <span>{selectedMethod.category}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black font-game text-white tracking-tight">
                  [{selectedMethod.name}]
                </h3>
                <p className="text-orange-200 text-xs sm:text-sm mt-1">
                  {selectedMethod.tagline}
                </p>

                {/* Direct cooking SFX audition buttons */}
                {selectedMethod.id === 'stir' && (
                  <button
                    type="button"
                    onClick={() => sfx.playSizzle()}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/30 hover:bg-orange-500/40 text-amber-200 border border-orange-400/50 text-xs font-bold font-game transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-orange-300 animate-pulse" />
                    <span>🔥 지글지글 볶는 소리 다시 듣기</span>
                  </button>
                )}

                {selectedMethod.id === 'boil' && (
                  <button
                    type="button"
                    onClick={() => sfx.playBoil()}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border border-amber-300/40 text-xs font-bold font-game transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>🍲 보글보글 끓는 소리 다시 듣기</span>
                  </button>
                )}
              </div>
            </div>

            {/* Redraw button */}
            <button
              onClick={handleDrawCard}
              className="flex items-center gap-1.5 bg-[#450a0a]/80 hover:bg-[#340707] text-orange-200 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition border border-orange-500/40 shrink-0 font-game shadow-inner cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>다른 카드 다시 뽑기</span>
            </button>
          </motion.div>

          {/* Educational Theory Reference Box: 생조리 vs 가열조리 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Raw Cooking (생조리) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-sky-200 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sky-900 text-base flex items-center gap-2 font-game">
                  <Droplets className="w-5 h-5 text-sky-600" />
                  [생조리]
                </h4>
                <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                  열 가열 X
                </span>
              </div>
              <p className="text-xs font-bold text-stone-700 mb-2">
                {THEORY_INFO.raw.summary}
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 flex-1">
                {THEORY_INFO.raw.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2.5 border-t border-sky-100 text-[11px] text-sky-950 bg-sky-50 p-2 rounded-lg">
                <strong>마라탕 연결:</strong> 딱딱한 당면과 푸주를 2시간 동안 물에 불려 부드럽게 만드는 과정!
              </div>
            </div>

            {/* Heated Cooking (가열조리) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-orange-200 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#c2410c] text-base flex items-center gap-2 font-game">
                  <Flame className="w-5 h-5 text-[#ea580c]" />
                  [가열조리]
                </h4>
                <span className="text-xs bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-full border border-orange-200">
                  열 가열 O
                </span>
              </div>
              <p className="text-xs font-bold text-stone-700 mb-2">
                {THEORY_INFO.heated.summary}
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 flex-1">
                {THEORY_INFO.heated.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#ea580c] font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2.5 border-t border-orange-100 text-[11px] text-orange-950 bg-orange-50 p-2 rounded-lg">
                <strong>마라탕 연결:</strong> 파기름을 내는 [볶기(기름)], 육수에서 재료를 익히는 [끓이기(물)]!
              </div>
            </div>

          </div>

          {/* Student Guided Inquiry Form (3 Questions) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-orange-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-4">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-stone-900 font-game flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ea580c]" />
                  모둠 탐구 수사 보고서: [{selectedMethod.name}]
                </h4>
                <p className="text-xs text-stone-500">
                  모둠원과 토의하여 아래 3가지 탐구 질문에 답을 작성해 보세요.
                </p>
              </div>

              {/* Toggle Model Answer */}
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setShowModelAnswer(!showModelAnswer);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-stone-700 text-xs font-bold transition font-game cursor-pointer border border-orange-200"
              >
                {showModelAnswer ? <EyeOff className="w-4 h-4 text-stone-600" /> : <Eye className="w-4 h-4 text-[#ea580c]" />}
                <span>{showModelAnswer ? '교사 예시 가리기' : '교사용 정답 예시 보기'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmitAnswers} className="space-y-6">
              
              {/* Question 1 */}
              <div className="bg-orange-50/50 p-4 sm:p-5 rounded-2xl border border-orange-200 space-y-2.5">
                <label className="block text-sm sm:text-base font-bold text-stone-900">
                  ① 이 조리방법([{selectedMethod.name}])은 무엇인가요? (생조리 vs 가열조리 분류 및 정의)
                </label>

                {/* Quick Word chips for cooperative input */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="text-stone-400 font-semibold self-center mr-1">키워드 추천:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickInsert(1, `${selectedMethod.category}에 속하며,`)}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                  >
                    + {selectedMethod.category}
                  </button>
                  {selectedMethod.heatMedium && (
                    <button
                      type="button"
                      onClick={() => handleQuickInsert(1, `${selectedMethod.heatMedium}을(를) 매개체로 열을 전달하여 조리한다.`)}
                      className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                    >
                      + {selectedMethod.heatMedium} 매개체
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleQuickInsert(1, '식품을 부드럽게 익히고 맛을 살린다.')}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                  >
                    + 맛과 조직감 변화
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  placeholder={`예: ${selectedMethod.name}은(는) ${selectedMethod.category}에 해당하며, ${selectedMethod.description}`}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-orange-200"
                />

                {showModelAnswer && (
                  <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 mt-2">
                    <strong className="text-amber-900 font-bold">💡 정답 예시: </strong>
                    {selectedMethod.description} ({selectedMethod.category} / 열 매개체: {selectedMethod.heatMedium || '없음'})
                  </div>
                )}
              </div>

              {/* Question 2 */}
              <div className="bg-orange-50/50 p-4 sm:p-5 rounded-2xl border border-orange-200 space-y-2.5">
                <label className="block text-sm sm:text-base font-bold text-stone-900">
                  ② 마라탕에서는 어떤 재료에 이 조리방법이 사용되었나요? (레시피 연결)
                </label>

                {/* Quick Word chips */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="text-stone-400 font-semibold self-center mr-1">키워드 추천:</span>
                  {selectedMethod.id === 'soak' && (
                    <button
                      type="button"
                      onClick={() => handleQuickInsert(2, '당면류와 푸주를 물에 담가 2시간 불릴 때 사용했다.')}
                      className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                    >
                      + 당면·푸주 2시간 불리기
                    </button>
                  )}
                  {selectedMethod.id === 'stir' && (
                    <button
                      type="button"
                      onClick={() => handleQuickInsert(2, '파와 마늘을 기름에 볶아 파기름을 만들 때 사용했다.')}
                      className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                    >
                      + 파와 마늘 볶기 (파기름)
                    </button>
                  )}
                  {selectedMethod.id === 'boil' && (
                    <button
                      type="button"
                      onClick={() => handleQuickInsert(2, '사골육수에 야채, 고기, 라면 등 모든 재료를 넣고 끓일 때 사용했다.')}
                      className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                    >
                      + 사골육수에 야채·고기·면 끓이기
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  placeholder={`예: ${selectedMethod.maratangUsage}`}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-orange-200"
                />

                {showModelAnswer && (
                  <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 mt-2">
                    <strong className="text-amber-900 font-bold">💡 정답 예시: </strong>
                    {selectedMethod.maratangUsage}
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div className="bg-orange-50/50 p-4 sm:p-5 rounded-2xl border border-orange-200 space-y-2.5">
                <label className="block text-sm sm:text-base font-bold text-stone-900">
                  ③ 이 조리방법을 사용하면 식품에 어떤 변화(맛, 향, 식감, 영양)가 나타나나요?
                </label>

                {/* Quick Word chips */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="text-stone-400 font-semibold self-center mr-1">키워드 추천:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickInsert(3, '식감이 부드러워지고 소화 흡수가 잘 된다.')}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                  >
                    + 식감 연화 & 소화 흡수
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickInsert(3, '풍미 성분이 기름/국물에 우러나와 맛이 깊어진다.')}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-900 hover:bg-orange-200 transition font-bold border border-orange-300/50 cursor-pointer"
                  >
                    + 풍미 성분 용출 & 깊은 맛
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={answer3}
                  onChange={(e) => setAnswer3(e.target.value)}
                  placeholder={`예: ${selectedMethod.effect}`}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3.5 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-orange-200"
                />

                {showModelAnswer && (
                  <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 mt-2">
                    <strong className="text-amber-900 font-bold">💡 정답 예시: </strong>
                    {selectedMethod.effect}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white rounded-2xl font-black text-base sm:text-lg font-game shadow-[0_4px_0_#7f1d1d] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition cursor-pointer border border-amber-300/40"
                >
                  <Send className="w-5 h-5" />
                  <span>탐구 보고서 제출하고 3단계로 이동하기 →</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playFanfare();
                    onComplete();
                  }}
                  className="w-full sm:w-auto px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-sm font-game border border-stone-300 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>3단계로 바로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

            {/* Submission Successful Banner */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border-2 border-emerald-400 p-6 rounded-3xl text-center space-y-4 mt-6 shadow-md"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-game">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MISSION 2 탐구 보고서 통과</span>
                </div>

                <h3 className="text-2xl font-black text-emerald-950 font-game">
                  조리방법의 비밀을 성공적으로 밝혔습니다!
                </h3>

                <p className="text-emerald-800 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  이제 마지막 수사 미션인 <strong>[MISSION 3: 마라탕 8단계 조리 순서 재구성]</strong>으로 이동하여 전체 요리 과정을 완성하세요!
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sfx.playFanfare();
                    onComplete();
                  }}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white rounded-2xl font-black text-lg sm:text-xl font-game shadow-[0_4px_0_#450a0a] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mx-auto cursor-pointer border border-amber-300/40"
                >
                  <span>MISSION CLEAR! 마지막 미션으로 →</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
