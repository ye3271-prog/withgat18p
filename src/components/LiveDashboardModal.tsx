import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  Wifi,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Zap,
  Trophy
} from 'lucide-react';
import { GROUPS_LIST } from '../data/cookingData';
import { GroupProgress } from '../types';
import { sfx } from '../utils/audio';

interface LiveDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allGroupsData: Record<string, GroupProgress>;
  currentGroup: string | null;
}

export const LiveDashboardModal: React.FC<LiveDashboardModalProps> = ({
  isOpen,
  onClose,
  allGroupsData,
  currentGroup,
}) => {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'active'>('all');

  if (!isOpen) return null;

  // Compute classroom statistics & ranking
  const registeredGroups = GROUPS_LIST.map((name) => allGroupsData[name] || {
    groupName: name,
    score: 0,
    speedBonus: 0,
    totalScore: 0,
    mission1Cleared: false,
    mission2Cleared: false,
    mission3Cleared: false,
    currentMission: 1,
    lastUpdated: 0,
  });

  // Calculate ranks based on totalScore descending, then totalTimeSeconds ascending
  const sortedForRanking = [...registeredGroups].sort((a, b) => {
    const aTotal = a.totalScore || (a.score + (a.speedBonus || 0));
    const bTotal = b.totalScore || (b.score + (b.speedBonus || 0));
    if (bTotal !== aTotal) return bTotal - aTotal;
    const aTime = a.totalTimeSeconds || 999999;
    const bTime = b.totalTimeSeconds || 999999;
    return aTime - bTime;
  });

  const getRank = (groupName: string) => {
    const index = sortedForRanking.findIndex((g) => g.groupName === groupName);
    return index + 1;
  };

  const activeCount = registeredGroups.filter((g) => g.score > 0 || g.mission1Cleared).length;
  const m1ClearedCount = registeredGroups.filter((g) => g.mission1Cleared).length;
  const m2ClearedCount = registeredGroups.filter((g) => g.mission2Cleared).length;
  const m3ClearedCount = registeredGroups.filter((g) => g.mission3Cleared).length;

  const filteredGroups = registeredGroups.filter((g) => {
    if (filter === 'submitted') return g.mission2Cleared && g.mission2Answer;
    if (filter === 'active') return g.score > 0 || g.mission1Cleared;
    return true;
  });

  const toggleExpand = (groupName: string) => {
    sfx.playClick();
    setExpandedGroup((prev) => (prev === groupName ? null : groupName));
  };

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden my-auto flex flex-col max-h-[92vh] cursor-default"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white p-4 sm:p-6 flex items-center justify-between border-b-2 border-orange-500 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#dc2626] flex items-center justify-center shadow-lg border-2 border-amber-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black font-game text-white tracking-tight">
                    실시간 모둠 현황판 & 탐구 결과
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-400 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    클라우드 실시간 연동
                  </span>
                </div>
                <p className="text-xs text-orange-200 mt-0.5">
                  어떤 기기(전자칠판, 모둠 노트북, 태블릿)에서든 모둠별 탐구 답변과 미션 진행도가 즉시 동기화됩니다.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-[#450a0a] hover:bg-[#340707] text-orange-200 hover:text-white transition border border-orange-500/50 shadow-sm cursor-pointer"
              title="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats Overview Banner */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 border-b border-orange-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-center">
            <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200 shadow-xs">
              <span className="text-[11px] text-stone-500 font-bold block">참여 중인 모둠</span>
              <span className="text-lg sm:text-xl font-black text-[#7f1d1d] font-game">
                {activeCount} <span className="text-xs text-stone-400 font-normal">/ {GROUPS_LIST.length}</span>
              </span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200 shadow-xs">
              <span className="text-[11px] text-stone-500 font-bold block">1단계 유추 완료</span>
              <span className="text-lg sm:text-xl font-black text-orange-600 font-game">
                {m1ClearedCount} <span className="text-xs text-stone-400 font-normal">모둠</span>
              </span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200 shadow-xs">
              <span className="text-[11px] text-stone-500 font-bold block">2단계 보고서 제출</span>
              <span className="text-lg sm:text-xl font-black text-amber-600 font-game">
                {m2ClearedCount} <span className="text-xs text-stone-400 font-normal">모둠</span>
              </span>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-orange-200 shadow-xs">
              <span className="text-[11px] text-stone-500 font-bold block">3단계 레이드 완료</span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 font-game">
                {m3ClearedCount} <span className="text-xs text-stone-400 font-normal">모둠</span>
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-stone-100 px-4 py-2.5 flex items-center justify-between border-b border-stone-200 text-xs shrink-0">
            <div className="flex items-center gap-1.5 font-bold font-game">
              <span className="text-stone-500 mr-1">필터:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filter === 'all' ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                전체 ({registeredGroups.length})
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filter === 'submitted' ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                2단계 보고서 제출 모둠 ({m2ClearedCount})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  filter === 'active' ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-200'
                }`}
              >
                참여 중 모둠 ({activeCount})
              </button>
            </div>

            <div className="text-[11px] text-stone-500 hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>실시간 변경 사항이 자동 반영됩니다</span>
            </div>
          </div>

          {/* Groups List */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#fffbf7]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map((group) => {
                const isCurrent = currentGroup === group.groupName;
                const isExpanded = expandedGroup === group.groupName;
                const m2 = group.mission2Answer;
                const rank = getRank(group.groupName);
                const rankBadge = rank === 1 ? '🥇 1위' : rank === 2 ? '🥈 2위' : rank === 3 ? '🥉 3위' : `${rank}위`;

                return (
                  <motion.div
                    key={group.groupName}
                    layout
                    className={`bg-white rounded-2xl border-2 transition shadow-sm overflow-hidden flex flex-col ${
                      isCurrent
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : group.mission3Cleared
                        ? 'border-emerald-300'
                        : group.mission2Cleared
                        ? 'border-amber-300'
                        : 'border-stone-200'
                    }`}
                  >
                    {/* Card Top Row */}
                    <div className="p-4 flex items-center justify-between border-b border-stone-100 bg-stone-50/60">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-game text-sm text-white ${
                          group.mission3Cleared
                            ? 'bg-emerald-600'
                            : group.mission2Cleared
                            ? 'bg-amber-600'
                            : group.mission1Cleared
                            ? 'bg-orange-600'
                            : 'bg-stone-400'
                        }`}>
                          {group.groupName.replace('모둠', '')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-stone-900 font-game text-base">
                              {group.groupName}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#dc2626] text-white font-bold px-2 py-0.5 rounded-full">
                                내 기기
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {group.mission3Cleared
                              ? '🏆 최종 레이드 완수'
                              : group.mission2Cleared
                              ? '✅ 2단계 탐구 보고서 통과'
                              : group.mission1Cleared
                              ? '🔍 1단계 유추 완료 (2단계 진행 중)'
                              : '⏳ 시작 대기 중'}
                          </span>
                        </div>
                      </div>

                      {/* Score Badge & Rank */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-0.5">
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                            rank === 1 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-game' 
                              : rank === 2 
                              ? 'bg-stone-200 text-stone-800 font-game' 
                              : rank === 3 
                              ? 'bg-orange-100 text-orange-900 font-game' 
                              : 'text-stone-400 font-bold'
                          }`}>
                            {rankBadge}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-base sm:text-xl font-black text-[#ea580c] font-game">
                            {group.score}
                          </span>
                          <span className="text-xs text-stone-500 font-normal">pt</span>
                        </div>
                        {group.speedBonus !== undefined && group.speedBonus > 0 && (
                          <span className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-0.5">
                            <Zap className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>보너스 +{group.speedBonus}pt</span>
                          </span>
                        )}
                        {group.totalTimeSeconds !== undefined && group.totalTimeSeconds > 0 && (
                          <span className="text-[10px] text-stone-400 block">
                            ⏱️ {Math.floor(group.totalTimeSeconds / 60)}분 {group.totalTimeSeconds % 60}초
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mission Step Badges */}
                    <div className="px-4 py-2.5 flex items-center justify-between bg-stone-50/30 text-xs border-b border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          group.mission1Cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'
                        }`}>
                          M1 사진유추 {group.mission1Cleared ? '✓' : ''}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          group.mission2Cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'
                        }`}>
                          M2 조리과학 {group.mission2Cleared ? '✓' : ''}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          group.mission3Cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-400'
                        }`}>
                          M3 순서재구성 {group.mission3Cleared ? '✓' : ''}
                        </span>
                      </div>

                      {m2 && (
                        <span className="text-[11px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-md border border-orange-200">
                          {m2.methodName || '조리방법'} 탐구
                        </span>
                      )}
                    </div>

                    {/* Mission 2 Inquiry Answer Section */}
                    <div className="p-4 text-xs space-y-2 flex-1">
                      {m2 ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-stone-700 font-bold">
                            <span className="flex items-center gap-1.5 text-stone-800 font-game">
                              <BookOpen className="w-3.5 h-3.5 text-[#ea580c]" />
                              모둠 탐구 보고서: [{m2.methodName}]
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleExpand(group.groupName)}
                              className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-0.5 cursor-pointer underline text-[11px]"
                            >
                              <span>{isExpanded ? '간략히 보기' : '전체 답변 보기'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>

                          <div className={`space-y-1.5 bg-orange-50/60 p-3 rounded-xl border border-orange-200/80 ${
                            isExpanded ? '' : 'line-clamp-3'
                          }`}>
                            <div>
                              <strong className="text-orange-950 font-bold block mb-0.5">① 조리법 분류 & 정의:</strong>
                              <p className="text-stone-700 bg-white p-2 rounded-lg border border-orange-100">
                                {m2.answer1 || '답변 미입력'}
                              </p>
                            </div>

                            {isExpanded && (
                              <>
                                <div className="mt-2">
                                  <strong className="text-orange-950 font-bold block mb-0.5">② 마라탕 속 재료 사용:</strong>
                                  <p className="text-stone-700 bg-white p-2 rounded-lg border border-orange-100">
                                    {m2.answer2 || '답변 미입력'}
                                  </p>
                                </div>

                                <div className="mt-2">
                                  <strong className="text-orange-950 font-bold block mb-0.5">③ 조리 시 식품 변화:</strong>
                                  <p className="text-stone-700 bg-white p-2 rounded-lg border border-orange-100">
                                    {m2.answer3 || '답변 미입력'}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center text-stone-400 text-xs">
                          {group.mission1Cleared
                            ? '✍️ 현재 2단계 조리과학 탐구 보고서를 작성 중입니다...'
                            : '⏳ 1단계 사진 유추 미션을 진행하고 있습니다.'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-stone-50 p-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
            <span className="text-stone-600">
              💡 교사용 전자칠판에 띄워두면 모든 모둠의 실시간 발표 자료 및 비교 토의 자료로 활용할 수 있습니다.
            </span>
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white rounded-xl font-bold font-game hover:from-[#c2410c] hover:to-[#b91c1c] transition shadow-sm cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
