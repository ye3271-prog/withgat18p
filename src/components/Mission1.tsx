import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChefHat, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  Droplets,
  ArrowRight,
  Info,
  Volume2,
  Search,
  Eye,
  Check,
  Lock,
  ZoomIn
} from 'lucide-react';
import { COOKING_METHODS_DATA } from '../data/cookingData';
import { CookingMethod } from '../types';
import { sfx } from '../utils/audio';

interface Mission1Props {
  onComplete: () => void;
  onOpenRecipe: () => void;
  isAlreadyCleared: boolean;
}

interface PhotoClue {
  id: number;
  label: string;
  icon: string;
  pinX: number; // percentage from left
  pinY: number; // percentage from top
  title: string;
  observation: string;
  deductionQuestion: string;
}

const PHOTO_CLUES: PhotoClue[] = [
  {
    id: 1,
    label: '단서 1: 부드러운 당면 & 푸주',
    icon: '💧',
    pinX: 28,
    pinY: 65,
    title: '물리적 전처리 흔적 (쫄깃한 당면과 건두부)',
    observation: '국물 속에 보이는 납작당면과 푸주(건두부)가 딱딱하지 않고 부드럽고 탄력 있게 촉촉하게 풀려 있습니다.',
    deductionQuestion: '이 재료들은 원래 돌처럼 바짝 말라있던 건조 상태입니다. 냄비에 넣고 가열하기 전, 찬물에 푹 담가 수분을 빨아들이게 하는 조리방법은 무엇일까요?'
  },
  {
    id: 2,
    label: '단서 2: 붉은 고추기름 & 파기름 향',
    icon: '🔥',
    pinX: 52,
    pinY: 28,
    title: '기름을 매개로 한 향미 추출 흔적 (붉은 기름막)',
    observation: '국물 표면에 은은하게 번져있는 붉은 고추기름층과 고소하고 얼얼한 파·마늘의 깊은 불향이 감돕니다.',
    deductionQuestion: '대파와 마늘의 지용성 향미 성분을 뽑아내고 마라 소스의 풍미를 극대화하기 위해, 기름을 두르고 센 불에 재료를 달달 익히는 조리방법은 무엇일까요?'
  },
  {
    id: 3,
    label: '단서 3: 100℃ 육수와 익은 채소·고기',
    icon: '🍲',
    pinX: 72,
    pinY: 55,
    title: '물을 매개로 한 대류 가열 흔적 (진한 탕 국물)',
    observation: '청경채, 버섯, 소고기가 넉넉한 사골 국물 속에서 촉촉하게 골고루 익어 국물과 한데 어우러져 있습니다.',
    deductionQuestion: '100℃의 뜨거운 육수를 매개체로 재료들을 푹 담가 열을 전달하며 재료 맛을 우려내며 익히는 조리방법은 무엇일까요?'
  },
  {
    id: 4,
    label: '단서 4: 튀김·구이 흔적의 부재 (소거법)',
    icon: '🔍',
    pinX: 82,
    pinY: 22,
    title: '오답을 걸러내는 소거법 단서',
    observation: '마라탕 그릇 어디를 보아도 기름에 바삭하게 튀겨낸 튀김옷이나, 불에 직접 닿아 거뭇하게 그을린 구이 자국, 찜기에 찐 자국이 없습니다.',
    deductionQuestion: '기름에 푹 담가 튀기거나(튀기기), 불에 굽거나(굽기), 수증기로만 쪄내는(찌기) 방법은 이 완성 요리의 모습과 맞을까요?'
  }
];

export const Mission1: React.FC<Mission1Props> = ({ 
  onComplete, 
  onOpenRecipe,
  isAlreadyCleared 
}) => {
  // Selected cooking method IDs
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return isAlreadyCleared ? ['boil', 'stir', 'soak'] : [];
  });
  
  // Feedback message state
  const [feedback, setFeedback] = useState<{ text: string; type: 'error' | 'info' | 'success' } | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  // Active Photo Clue
  const [activeClueId, setActiveClueId] = useState<number>(1);

  const correctMethods = COOKING_METHODS_DATA.filter((m) => m.isCorrect);
  const correctIds = correctMethods.map((m) => m.id);

  // Check if all 3 correct methods are selected
  const allCorrectFound = correctIds.every((id) => selectedIds.includes(id));
  const foundCorrectCount = selectedIds.filter((id) => correctIds.includes(id)).length;

  const currentClue = PHOTO_CLUES.find((c) => c.id === activeClueId) || PHOTO_CLUES[0];

  // Specific deduction explanations for each cooking method
  const methodDeductions: Record<string, { correct: boolean; message: string }> = {
    soak: {
      correct: true,
      message: '✨ [불리기 유추 성공!] 사진 속 딱딱했던 마른 중국당면과 푸주가 찬물에 수분을 듬뿍 머금어 부드럽고 쫄깃하게 풀려있습니다. 가열 전 필수 전처리 생조리법입니다.'
    },
    stir: {
      correct: true,
      message: '✨ [볶기 유추 성공! 🔥지글지글] 국물 표면에 은은하게 번진 붉은 고추기름과 깊은 불향은 대파와 마늘을 식용유에 볶아 향미유를 먼저 추출했기 때문입니다.'
    },
    boil: {
      correct: true,
      message: '✨ [끓이기 유추 성공! 🍲보글보글] 100℃의 뜨거운 사골 육수에 채소, 버섯, 고기, 면을 넣고 푹 끓여 깊은 국물 맛을 우려내며 부드럽게 익혔습니다.'
    },
    deep_fry: {
      correct: false,
      message: '❌ [튀기기 오답] 사진 속 마라탕 재료를 다시 관찰해 보세요! 기름에 바삭하게 튀겨낸 튀김옷이 전혀 없습니다. 국물 요리에는 튀기기가 쓰이지 않습니다.'
    },
    grill: {
      correct: false,
      message: '❌ [굽기 오답] 마라탕 재료에 직화 불이나 오븐에 구워 거뭇하게 그을린 자국이 있나요? 사진 속 촉촉한 국물과 재료를 다시 관찰해 보세요.'
    },
    steam: {
      correct: false,
      message: '❌ [찌기 오답] 수증기로만 쪄낸 요리가 아니라 넉넉한 탕 국물에 푹 잠겨 있습니다. 국물 요리의 익힘 방식을 생각해 보세요.'
    },
    braise: {
      correct: false,
      message: '❌ [조리기 오답] 국물을 바짝 졸여 윤기 나게 양념을 배게 한 조림 요리가 아닙니다. 넉넉한 국물을 함께 떠먹는 탕(湯) 요리입니다.'
    },
    blanch: {
      correct: false,
      message: '❌ [데치기 오답] 끓는 물에 살짝만 담갔다 건져내어 찬물에 식힌 것이 아니라, 육수에서 재료들이 완전히 익도록 끓여냈습니다.'
    },
    fry_pan: {
      correct: false,
      message: '❌ [부치기 오답] 기름을 얇게 두르고 팬에 반죽을 넓게 지져낸 전이나 부침개 형태가 아닙니다.'
    }
  };

  const handleCardClick = (method: CookingMethod) => {
    if (selectedIds.includes(method.id)) {
      // Toggle off if already selected
      sfx.playClick();
      setSelectedIds(selectedIds.filter((id) => id !== method.id));
      setFeedback(null);
      return;
    }

    const deduction = methodDeductions[method.id];

    if (method.isCorrect) {
      if (method.id === 'stir') {
        sfx.playSizzle();
      } else if (method.id === 'boil') {
        sfx.playBoil();
      } else {
        sfx.playCorrect();
      }

      const newSelected = [...selectedIds, method.id];
      setSelectedIds(newSelected);

      if (correctIds.every((id) => newSelected.includes(id))) {
        setTimeout(() => sfx.playFanfare(), 400);
        setFeedback({
          text: '🎉 축하합니다! 마라탕 완성 사진 속 3가지 핵심 조리방법(불리기, 볶기, 끓이기)을 모두 성공적으로 유추해 냈습니다!',
          type: 'success'
        });
      } else {
        setFeedback({
          text: deduction ? deduction.message : `정답입니다! [${method.name}]은(는) 마라탕 조리에 사용된 핵심 방법입니다.`,
          type: 'info'
        });
      }
    } else {
      sfx.playWrong();
      setShakingId(method.id);
      setTimeout(() => setShakingId(null), 600);

      setFeedback({
        text: deduction ? deduction.message : '사진 속 마라탕의 모습과 맞지 않는 조리방법입니다. 단서 사진을 다시 관찰해 보세요.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Mission Briefing Header - Warm Spicy Malatang Red Theme */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-orange-200 text-center relative overflow-hidden">
        {/* Decorative ambient bar */}
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#dc2626] via-[#ea580c] to-[#f59e0b]" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#c2410c] text-xs font-black mb-3 font-game shadow-xs border border-orange-300/50">
          <Flame className="w-3.5 h-3.5 text-[#ea580c] animate-pulse" />
          <span>MISSION 1</span>
          <span>•</span>
          <span>사진 관찰 & 조리법 유추 작전</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#7f1d1d] font-game mb-2 tracking-tight">
          「마라탕 완성 사진을 보고 조리방법을 유추하라!」
        </h2>

        <p className="text-stone-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          레시피를 보지 않고 <strong>완성된 마라탕 사진</strong>만을 관찰하여 조리법을 생각해야 합니다!<br className="hidden sm:inline" />
          재료의 질감, 국물의 붉은 기름막, 열기의 흔적을 분석하여 마라탕을 만들기 위해 반드시 필요했을 <strong>3가지 기본 조리방법</strong>을 유추해 보세요.
        </p>

        {/* Progress & Quick Action */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-xs sm:text-sm font-bold text-orange-900 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <span>사진 유추 성공: </span>
            <span className="text-[#ea580c] font-game text-base sm:text-lg">{foundCorrectCount}</span>
            <span>/ 3개</span>
          </div>

          <button
            id="open-kitchen-log-btn"
            onClick={() => {
              sfx.playClick();
              onOpenRecipe();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white font-bold px-4 py-2 rounded-2xl transition shadow-[0_3px_0_#7f1d1d] active:translate-y-0.5 active:shadow-none text-xs sm:text-sm font-game cursor-pointer border border-amber-300/40"
          >
            <ChefHat className="w-4 h-4" />
            <span>수사 보조 단서 (레시피 명칭 블라인드)</span>
          </button>
        </div>
      </div>

      {/* 🔍 Interactive Maratang Photo Clue Inspection Station */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-orange-300/80 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-orange-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#dc2626] to-[#ea580c] text-white flex items-center justify-center shadow-md">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black font-game text-stone-900 flex items-center gap-2">
                마라탕 단서 사진 정밀 관찰대
                <span className="text-[11px] font-sans font-bold bg-red-100 text-[#b91c1c] px-2.5 py-0.5 rounded-full border border-red-200">
                  사진 속 4개 핀 터치
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                사진 속 번호 핀을 눌러 완성된 상태에서 유추할 수 있는 조리 흔적과 과학적 질문을 확인하세요.
              </p>
            </div>
          </div>

          {/* Active clue chips navigation */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PHOTO_CLUES.map((clue) => {
              const isCurrent = clue.id === activeClueId;
              return (
                <button
                  key={clue.id}
                  id={`clue-tab-${clue.id}`}
                  onClick={() => {
                    sfx.playClick();
                    setActiveClueId(clue.id);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#dc2626] text-white shadow-md ring-2 ring-orange-300'
                      : 'bg-orange-50 text-stone-700 hover:bg-orange-100 hover:text-orange-900 border border-orange-200'
                  }`}
                >
                  <span>{clue.icon}</span>
                  <span className="hidden sm:inline">단서 {clue.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo View & Detective Note Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left: Interactive High-Resolution Food Photo with Clue Pins */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border-2 border-orange-300 bg-stone-900 shadow-md group">
            <div className="relative aspect-4/3 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
              <img
                src="/images/malatang_observation.jpg"
                alt="얼큰하고 진한 정통 마라탕 관찰 사진"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('malatang_observation.jpg')) {
                    target.src = '/images/malatang_bowl.jpg';
                  } else if (target.src.includes('malatang_bowl.jpg')) {
                    target.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Malatang_from_South_Korea.jpg';
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Vignette Overlay for pin contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

              {/* Photo Title Watermark Badge */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-white/20 pointer-events-none">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>관찰 대상 #01: 얼큰한 마라탕 한 그릇 (정통 마라탕)</span>
              </div>

              {/* 4 Interactive Glowing Clue Pins on the Photo */}
              {PHOTO_CLUES.map((clue) => {
                const isActive = clue.id === activeClueId;
                return (
                  <button
                    key={clue.id}
                    id={`photo-pin-${clue.id}`}
                    onClick={() => {
                      sfx.playClick();
                      setActiveClueId(clue.id);
                    }}
                    style={{ left: `${clue.pinX}%`, top: `${clue.pinY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer transition-all duration-300 focus:outline-none ${
                      isActive ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                    title={clue.label}
                  >
                    {/* Animated Pulse Waves */}
                    <span className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                      isActive ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                    
                    {/* Pin Center Badge */}
                    <div className={`relative px-2.5 py-1 rounded-full font-game text-xs font-black flex items-center gap-1 shadow-xl border-2 ${
                      isActive
                        ? 'bg-[#dc2626] text-white border-amber-300 ring-4 ring-orange-500/50'
                        : 'bg-[#7f1d1d]/90 text-white border-orange-300 hover:bg-[#991b1b]'
                    }`}>
                      <span>{clue.icon}</span>
                      <span className="text-[10px] sm:text-xs">단서 {clue.id}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Photo Info Footnote */}
            <div className="p-2.5 bg-stone-950 text-stone-300 text-[11px] flex items-center justify-between px-4 border-t border-stone-800">
              <span>사진 속 번호 핀을 눌러 해당 부위의 시각적 흔적과 질문을 관찰해 보세요.</span>
              <span className="text-amber-400 font-bold hidden sm:inline">정밀 관찰 4개 포인트</span>
            </div>
          </div>

          {/* Right: Detective Observation & Deduction Note */}
          <div className="lg:col-span-5 bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-2xl p-4 sm:p-5 border-2 border-orange-200 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black font-game text-[#b91c1c] bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-xs">
                  <span>{currentClue.icon}</span>
                  <span>단서 {currentClue.id} 정밀 분석</span>
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {currentClue.label}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-stone-900 font-game mb-2">
                {currentClue.title}
              </h4>

              {/* Observation from photograph */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-xs mb-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                  <Eye className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>사진 속 시각적 관찰 포인트:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {currentClue.observation}
                </p>
              </div>

              {/* Deductive Thinking Prompt */}
              <div className="bg-amber-100/70 rounded-xl p-3 border border-amber-300/80 shadow-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>탐정의 조리법 유추 질문:</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
                  "{currentClue.deductionQuestion}"
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Feedback Message Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-start sm:items-center gap-3 border shadow-md font-medium text-xs sm:text-sm ${
              feedback.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 text-base font-bold'
                : 'bg-orange-50 border-orange-300 text-orange-950'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
            ) : feedback.type === 'success' ? (
              <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 animate-spin mt-0.5 sm:mt-0" />
            ) : (
              <Info className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5 sm:mt-0" />
            )}
            <p className="flex-1 leading-relaxed">{feedback.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deduction Action Instruction Bar */}
      <div className="flex items-center justify-between bg-orange-50 p-3 sm:p-4 rounded-2xl border border-orange-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-ping" />
          <span className="text-xs sm:text-sm font-bold text-stone-800">
            위 사진의 단서들을 종합하여, 마라탕 완성에 쓰인 <strong>핵심 조리방법 3가지</strong>를 아래 후보에서 선택하세요!
          </span>
        </div>
        <span className="text-xs text-stone-500 hidden sm:inline">
          (클릭하여 선택/해제)
        </span>
      </div>

      {/* Cooking Methods Cards Grid (9 items in Warm & Spicy Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
        {COOKING_METHODS_DATA.map((method) => {
          const isSelected = selectedIds.includes(method.id);
          const isShaking = shakingId === method.id;

          return (
            <motion.div
              key={method.id}
              animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(method)}
                className={`w-full relative p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center group cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-50 to-amber-50 border-[#ea580c] text-[#7c2d12] shadow-lg ring-2 ring-[#ea580c]'
                    : 'bg-white border-stone-200 hover:border-orange-400 text-stone-800 hover:shadow-md'
                }`}
              >
                {/* Status chip */}
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${
                  isSelected
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600'
                }`}>
                  {isSelected ? `${method.category} (선택됨)` : '조리방법 후보'}
                </span>

                {/* Big Emoji Icon */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl mb-2 bg-stone-50 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>

                {/* Name */}
                <h3 className={`text-base sm:text-xl font-black font-game mb-1 tracking-tight ${
                  isSelected ? 'text-[#7f1d1d]' : 'text-stone-800'
                }`}>
                  {method.name}
                </h3>

                {/* Tagline */}
                <p className={`text-[11px] sm:text-xs line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-amber-950 font-medium' : 'text-stone-500'
                }`}>
                  {method.tagline}
                </p>

                {/* Interactive Cooking Sound Preview for Stir & Boil */}
                {(method.id === 'stir' || method.id === 'boil') && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (method.id === 'stir') sfx.playSizzle();
                      if (method.id === 'boil') sfx.playBoil();
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 transition shadow-xs cursor-pointer"
                    title={method.id === 'stir' ? '지글거리는 볶음 소리 듣기' : '보글거리는 끓는 소리 듣기'}
                  >
                    <Volume2 className="w-3 h-3 text-[#ea580c] animate-pulse" />
                    <span>{method.id === 'stir' ? '지글지글 소리' : '보글보글 소리'}</span>
                  </span>
                )}

                {/* Checkmark badge when correct & selected */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 bg-[#ea580c] text-white rounded-full p-1 shadow-md"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Banner & Next Mission Button */}
      {allCorrectFound && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-amber-400 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white font-black text-xs uppercase tracking-wider font-game shadow-md animate-pulse border border-amber-300">
            <Sparkles className="w-4 h-4" /> ALL FOUND • MISSION 1 CLEAR
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-game text-amber-300">
            마라탕 사진 속 3대 핵심 조리방법을 모두 유추해 냈습니다!
          </h3>

          <div className="flex justify-center gap-3 text-sm sm:text-base font-game">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-amber-300/40 text-amber-200">💧 불리기</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-amber-300/40 text-amber-200">🔥 볶기</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-amber-300/40 text-amber-200">🍲 끓이기</span>
          </div>

          <p className="text-orange-200 text-xs sm:text-sm max-w-md mx-auto">
            사진 관찰을 통해 조리법을 밝혀냈습니다! 이제 조리방법들의 생조리·가열조리 과학적 원리를 규명하는 2단계 탐구 미션으로 진입합니다.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.playFanfare();
              onComplete();
            }}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white rounded-2xl font-black text-lg sm:text-xl font-game shadow-[0_4px_0_#450a0a] active:translate-y-1 active:shadow-none transition flex items-center justify-center gap-2 mx-auto cursor-pointer border border-amber-300"
          >
            <span>MISSION CLEAR! 다음 미션으로 →</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

    </div>
  );
};
