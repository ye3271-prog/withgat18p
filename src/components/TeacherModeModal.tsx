import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GraduationCap, 
  KeyRound, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Sparkles,
  Users,
  Compass,
  Award,
  Volume2,
  Flame
} from 'lucide-react';
import { COOKING_METHODS_DATA, RECIPE_STEPS_DATA, GROUPS_LIST } from '../data/cookingData';
import { MissionId, GroupProgress } from '../types';
import { sfx } from '../utils/audio';

interface TeacherModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: string | null;
  currentScore: number;
  currentMission: MissionId;
  allGroupsData: Record<string, GroupProgress>;
  onJumpToMission: (mission: MissionId | 'start' | 'complete') => void;
  onResetGroup: (groupName: string) => void;
  onResetAll: () => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  isOpen,
  onClose,
  currentGroup,
  currentScore,
  currentMission,
  allGroupsData,
  onJumpToMission,
  onResetGroup,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<'answers' | 'groups' | 'controls' | 'guide'>('answers');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header in Warm Spicy Malatang Red */}
          <div className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-orange-500 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#dc2626] flex items-center justify-center shadow-lg border border-amber-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-game flex items-center gap-2">
                  교사용 대시보드 & 전자칠판 컨트롤러
                </h3>
                <p className="text-xs text-orange-200">
                  중학교 기술·가정 [식생활과 조리] 수업 통제 및 모둠 현황 모니터링
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#450a0a] hover:bg-[#340707] text-orange-200 hover:text-white transition border border-orange-500/50 shadow-sm cursor-pointer"
              title="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-stone-100 p-2 flex flex-wrap gap-1.5 border-b border-stone-200 shrink-0 text-xs sm:text-sm font-bold font-game">
            <button
              onClick={() => { sfx.playClick(); setActiveTab('answers'); }}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'answers' ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              📖 정답 및 교육 해설
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('groups'); }}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'groups' ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              👥 모둠별 진행 현황
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('controls'); }}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'controls' ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              ⚡ 전자칠판 단계 제어
            </button>
            <button
              onClick={() => { sfx.playClick(); setActiveTab('guide'); }}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'guide' ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md' : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              💡 수업 지도 가이드
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#fffaf5] text-stone-800">
            
            {/* Tab 1: Answers & Theory */}
            {activeTab === 'answers' && (
              <div className="space-y-5">
                {/* Mission 1 Answers */}
                <div className="bg-white p-5 rounded-2xl border-2 border-orange-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                    <h4 className="font-black text-[#7f1d1d] font-game text-base flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#ea580c]" />
                      MISSION 1 정답: 마라탕 사진 속 3대 핵심 조리방법
                    </h4>
                    <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full border border-orange-200">
                      정답 3개
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <li className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                      <strong className="text-sky-900 block font-bold text-sm mb-1">1. 불리기 (생조리)</strong>
                      <p className="text-stone-600">당면과 푸주를 찬물에 2시간 담가 수분을 흡수시킴 (물리적 전처리)</p>
                    </li>
                    <li className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex flex-col justify-between">
                      <div>
                        <strong className="text-orange-950 block font-bold text-sm mb-1">2. 볶기 (가열조리-기름)</strong>
                        <p className="text-stone-600">파와 마늘을 기름에 볶아 지용성 향미 성분을 우려내 파기름 완성</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => sfx.playSizzle()}
                        className="mt-2 inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-200/80 hover:bg-orange-300 text-orange-950 text-[11px] font-bold transition shadow-xs w-full cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-orange-700" />
                        <span>🔥 지글지글 볶는 소리 듣기</span>
                      </button>
                    </li>
                    <li className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col justify-between">
                      <div>
                        <strong className="text-amber-950 block font-bold text-sm mb-1">3. 끓이기 (가열조리-물)</strong>
                        <p className="text-stone-600">100℃ 육수에 푸주, 채소, 고기, 라면을 순차적으로 끓여 익힘</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => sfx.playBoil()}
                        className="mt-2 inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 text-[11px] font-bold transition shadow-xs w-full cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>🍲 보글보글 끓는 소리 듣기</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Mission 2 Answers */}
                <div className="bg-white p-5 rounded-2xl border-2 border-orange-200 shadow-sm space-y-2">
                  <h4 className="font-black text-[#7f1d1d] font-game text-base border-b border-orange-100 pb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#ea580c]" />
                    MISSION 2 과학적 원리 분석 기준
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 bg-stone-50 border rounded-xl">
                      <span className="font-bold text-sky-800 block mb-1">[생조리의 핵심]</span>
                      <p className="text-stone-600">
                        열을 가하지 않아 비타민 C 등 수용성/열민감성 영양소 파괴가 적고, 본래의 향미와 식감을 유지합니다.
                      </p>
                    </div>
                    <div className="p-3 bg-stone-50 border rounded-xl">
                      <span className="font-bold text-[#c2410c] block mb-1">[가열조리의 핵심]</span>
                      <p className="text-stone-600">
                        물(끓이기), 기름(볶기) 등으로 열을 전달하여 조직을 부드럽게 연화시키고, 소화 흡수율을 높이며 위생적으로 안전합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mission 3 Answers */}
                <div className="bg-white p-5 rounded-2xl border-2 border-orange-200 shadow-sm space-y-2">
                  <h4 className="font-black text-[#7f1d1d] font-game text-base border-b border-orange-100 pb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#ea580c]" />
                    MISSION 3 표준 조리 8단계 순서
                  </h4>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                    {RECIPE_STEPS_DATA.map((s) => (
                      <li key={s.stepNumber} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border">
                        <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          {s.stepNumber}
                        </span>
                        <span className="font-bold text-stone-800">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 2: Groups Progress */}
            {activeTab === 'groups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#ea580c]" />
                    전체 모둠 실시간 진행도
                  </h4>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    전 기기 클라우드 연동 중
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GROUPS_LIST.map((group) => {
                    const data = allGroupsData[group];
                    const isCurrent = currentGroup === group;
                    const groupScore = data ? data.score : (isCurrent ? currentScore : 0);
                    const isM1 = data ? data.mission1Cleared : false;
                    const isM2 = data ? data.mission2Cleared : false;
                    const isM3 = data ? data.mission3Cleared : false;
                    const m2 = data?.mission2Answer;

                    return (
                      <div
                        key={group}
                        className={`p-3.5 rounded-2xl border-2 transition ${
                          isCurrent
                            ? 'bg-orange-50 border-[#ea580c] shadow-md ring-2 ring-orange-200'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-stone-800 font-game text-sm">{group}</span>
                          {isCurrent && (
                            <span className="text-[9px] bg-[#dc2626] text-white font-bold px-1.5 py-0.5 rounded">
                              현재 기기
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-[#ea580c] mb-2 font-game">
                          {groupScore} pt
                        </div>

                        <div className="flex items-center gap-1 text-[10px] mb-2">
                          <span className={`px-1.5 py-0.5 rounded font-bold ${isM1 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>M1 {isM1 ? '✓' : ''}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${isM2 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>M2 {isM2 ? '✓' : ''}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${isM3 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>M3 {isM3 ? '✓' : ''}</span>
                        </div>

                        {/* M2 Inquiry Answer Preview */}
                        {m2 ? (
                          <div className="text-[10px] bg-amber-50 p-2 rounded-xl border border-amber-200/80 mb-2">
                            <span className="font-bold text-amber-950 block mb-0.5">[{m2.methodName}] 탐구 제출 완료</span>
                            <p className="text-stone-700 line-clamp-2 italic">"{m2.answer1}"</p>
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-400 p-1.5 bg-stone-50 rounded-lg text-center mb-2">
                            {isM1 ? '2단계 작성 중...' : '시작 대기'}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`[${group}]의 진행 기록을 초기화하시겠습니까?`)) {
                              sfx.playClick();
                              onResetGroup(group);
                            }
                          }}
                          className="w-full pt-1.5 border-t border-stone-200 text-[10px] text-rose-500 hover:underline text-center block cursor-pointer"
                        >
                          모둠 초기화
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Blackboard Controls */}
            {activeTab === 'controls' && (
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-orange-200 shadow-sm space-y-3">
                  <h4 className="font-black text-stone-900 font-game text-base flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#ea580c]" />
                    전자칠판 화면 즉시 점프 (수업 진행용)
                  </h4>
                  <p className="text-xs text-stone-500">
                    교사가 시범을 보이거나 단계별 설명을 진행할 때 화면을 원하는 미션으로 바로 이동할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                    <button
                      onClick={() => { sfx.playClick(); onJumpToMission('start'); onClose(); }}
                      className="p-3 bg-stone-100 hover:bg-orange-100 text-stone-800 hover:text-orange-900 rounded-xl text-xs font-bold font-game transition border border-stone-200 cursor-pointer"
                    >
                      시작 화면
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); onJumpToMission(1); onClose(); }}
                      className="p-3 bg-orange-100 hover:bg-orange-200 text-orange-950 rounded-xl text-xs font-bold font-game transition border border-orange-300 cursor-pointer"
                    >
                      MISSION 1
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); onJumpToMission(2); onClose(); }}
                      className="p-3 bg-orange-100 hover:bg-orange-200 text-orange-950 rounded-xl text-xs font-bold font-game transition border border-orange-300 cursor-pointer"
                    >
                      MISSION 2
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); onJumpToMission(3); onClose(); }}
                      className="p-3 bg-orange-100 hover:bg-orange-200 text-orange-950 rounded-xl text-xs font-bold font-game transition border border-orange-300 cursor-pointer"
                    >
                      MISSION 3
                    </button>
                    <button
                      onClick={() => { sfx.playClick(); onJumpToMission('complete'); onClose(); }}
                      className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold font-game transition border border-amber-300 cursor-pointer"
                    >
                      최종 결과 화면
                    </button>
                  </div>
                </div>

                <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-rose-800 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> 전체 게임 데이터 리셋
                  </h4>
                  <p className="text-xs text-rose-600">
                    다음 교시 수업을 위해 모든 모둠의 점수 및 미션 진행 상황을 초기화합니다.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm("정말 모든 모둠의 데이터를 초기화하고 첫 화면으로 돌아가시겠습니까?")) {
                        sfx.playClick();
                        onResetAll();
                        onClose();
                      }
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm font-game cursor-pointer"
                  >
                    전체 모둠 데이터 초기화
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Pedagogical Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-5 rounded-2xl border border-orange-200">
                <h4 className="font-black text-[#7f1d1d] font-game text-base mb-2">
                  🎓 수업 설계 및 지도상의 유의점
                </h4>
                <div className="space-y-3">
                  <p>
                    <strong>1. 동기 유발:</strong> 학생들이 좋아하는 '마라탕'을 소재로 삼아 "우리가 맛있게 먹는 마라탕 한 그릇에는 어떤 조리 과학이 숨어 있을까?"라는 질문으로 흥미를 높입니다.
                  </p>
                  <p>
                    <strong>2. 사진 기반 유추:</strong> 1단계에서는 단순히 레시피를 베끼지 않고, 마라탕 완성 사진의 재료 상태(당면·푸주), 국물 위 고추기름막, 익은 채소와 육수를 관찰하여 조리법을 직접 유추하도록 지도합니다.
                  </p>
                  <p>
                    <strong>3. 모둠 협력:</strong> 모둠원들과 함께 "불리기가 왜 생조리일까?", "파기름을 왜 먼저 낼까?", "고기와 라면은 왜 나중에 넣을까?"를 토의하도록 유도합니다.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-end shrink-0">
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white font-bold px-6 py-2.5 rounded-2xl transition text-xs sm:text-sm font-game shadow-[0_3px_0_#7f1d1d] active:translate-y-0.5 active:shadow-none cursor-pointer border border-amber-300/40"
            >
              대시보드 닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
