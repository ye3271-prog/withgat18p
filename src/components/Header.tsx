import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  CheckCircle2, 
  ChefHat, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  GraduationCap,
  Sparkles,
  Award,
  Flame
} from 'lucide-react';
import { GameScreen, MissionId } from '../types';
import { sfx } from '../utils/audio';

interface HeaderProps {
  currentScreen: GameScreen;
  activeMission: MissionId;
  groupName: string | null;
  score: number;
  mission1Cleared: boolean;
  mission2Cleared: boolean;
  mission3Cleared: boolean;
  onOpenRecipe: () => void;
  onOpenTeacherMode: () => void;
  onSelectMission?: (mission: MissionId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  activeMission,
  groupName,
  score,
  mission1Cleared,
  mission2Cleared,
  mission3Cleared,
  onOpenRecipe,
  onOpenTeacherMode,
  onSelectMission,
}) => {
  const [isMuted, setIsMuted] = useState(sfx.isMuted);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
    if (!muted) sfx.playClick();
  };

  const toggleFullscreen = () => {
    sfx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Calculate overall progress percentage
  let progressPercent = 0;
  if (currentScreen === 'start' || currentScreen === 'group_select') {
    progressPercent = 0;
  } else if (currentScreen === 'mission1') {
    progressPercent = mission1Cleared ? 33 : 15;
  } else if (currentScreen === 'mission2') {
    progressPercent = mission2Cleared ? 66 : 45;
  } else if (currentScreen === 'mission3') {
    progressPercent = mission3Cleared ? 90 : 75;
  } else if (currentScreen === 'complete') {
    progressPercent = 100;
  }

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white border-b-2 border-orange-500/50 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Main top row */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 bg-[#450a0a]/80 px-3.5 py-1.5 rounded-2xl border border-orange-400/40 shadow-inner">
              <span className="text-xl sm:text-2xl animate-bounce">🍲</span>
              <div>
                <h1 className="text-sm sm:text-lg font-black tracking-tight text-white font-game flex items-center gap-1.5 italic">
                  마라탕 조리법 레이드
                  <span className="text-[10px] bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white font-sans px-2 py-0.5 rounded-full uppercase font-bold not-italic tracking-normal shadow-sm border border-orange-300/40">
                    중학 기술·가정
                  </span>
                </h1>
                <p className="text-[10px] sm:text-xs text-orange-200/90 hidden md:block font-medium">
                  식생활 교육 · 사진 속 조리방법 유추 & 과학 탐구
                </p>
              </div>
            </div>

            {/* Quick Recipe Access button (Spicy styled, with contextual clue mode indicator) */}
            <button
              id="header-recipe-btn"
              onClick={() => {
                sfx.playClick();
                onOpenRecipe();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#ea580c] to-[#dc2626] hover:from-[#c2410c] hover:to-[#b91c1c] text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition shadow-[0_3px_0_#7f1d1d] active:translate-y-0.5 active:shadow-none border border-amber-300/40 cursor-pointer"
              title={mission1Cleared ? "마라탕 표준 레시피 확인" : "사진 관찰 단서 및 조리 일지 (레시피 명칭 블라인드)"}
            >
              <ChefHat className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">
                {mission1Cleared ? '표준 레시피' : '레시피 단서'}
              </span>
              <span className="sm:hidden">
                {mission1Cleared ? '레시피' : '단서'}
              </span>
              {!mission1Cleared && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              )}
            </button>
          </div>

          {/* Group & Score & Control Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Group Badge */}
            <div className="bg-[#450a0a]/80 border border-orange-400/30 px-3 py-1.5 rounded-xl text-center shadow-inner">
              <span className="text-[10px] text-orange-200/80 block font-medium leading-tight">참여 모둠</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 font-game">
                {groupName || '모둠 미선택'}
              </span>
            </div>

            {/* Score Badge */}
            <div className="bg-[#450a0a]/80 border border-orange-500/50 px-3.5 py-1.5 rounded-xl text-center shadow-inner flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-orange-200/80 block font-medium leading-tight">레이드 점수</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 font-game">
                  {score} <span className="text-[10px] text-orange-200 font-normal">/ 300 pt</span>
                </span>
              </div>
            </div>

            {/* Utility buttons */}
            <div className="flex items-center gap-1">
              <button
                id="header-sound-btn"
                onClick={toggleSound}
                className="p-2 rounded-xl bg-[#5f1414] hover:bg-[#701a1a] text-orange-200 hover:text-white transition border border-orange-500/30"
                title={isMuted ? "소리 켜기" : "소리 끄기"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-amber-200" />}
              </button>

              <button
                id="header-fullscreen-btn"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-[#5f1414] hover:bg-[#701a1a] text-orange-200 hover:text-white transition border border-orange-500/30 hidden sm:block"
                title="전자칠판 전체화면 토글"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                id="header-teacher-btn"
                onClick={() => {
                  sfx.playClick();
                  onOpenTeacherMode();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#450a0a] hover:bg-[#340707] text-orange-200 hover:text-white transition border border-orange-500/40 text-xs font-bold"
                title="교사용 모드 열기"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">교사용 모드</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mission Breadcrumb & Progress Bar */}
        <div className="mt-2.5 pt-2 border-t border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* Mission Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs">
            <span className="text-orange-200 text-[11px] font-bold mr-1 hidden sm:inline">미션 로드맵:</span>

            {/* Mission 1 */}
            <button
              onClick={() => onSelectMission && onSelectMission(1)}
              disabled={currentScreen === 'start' || currentScreen === 'group_select'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition ${
                activeMission === 1 && currentScreen === 'mission1'
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md ring-2 ring-amber-300 font-black'
                  : mission1Cleared
                  ? 'bg-[#5c1313] text-orange-100 hover:bg-[#731919] border border-orange-400/30'
                  : 'bg-[#3b0808] text-orange-300/60'
              }`}
            >
              {mission1Cleared ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">1</span>
              )}
              <span>MISSION 1 (사진 유추)</span>
            </button>

            <span className="text-orange-400 text-xs">➔</span>

            {/* Mission 2 */}
            <button
              onClick={() => onSelectMission && onSelectMission(2)}
              disabled={currentScreen === 'start' || currentScreen === 'group_select'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                activeMission === 2 && currentScreen === 'mission2'
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md ring-2 ring-amber-300 font-black'
                  : mission2Cleared
                  ? 'bg-[#5c1313] text-orange-100 hover:bg-[#731919] border border-orange-400/30'
                  : 'bg-[#4a0d0d] text-orange-200 hover:bg-[#5c1313] border border-orange-500/30'
              }`}
            >
              {mission2Cleared ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">2</span>
              )}
              <span>MISSION 2 (조리과학)</span>
            </button>

            <span className="text-orange-400 text-xs">➔</span>

            {/* Mission 3 */}
            <button
              onClick={() => onSelectMission && onSelectMission(3)}
              disabled={currentScreen === 'start' || currentScreen === 'group_select'}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                activeMission === 3 && currentScreen === 'mission3'
                  ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626] text-white shadow-md ring-2 ring-amber-300 font-black'
                  : mission3Cleared
                  ? 'bg-[#5c1313] text-orange-100 hover:bg-[#731919] border border-orange-400/30'
                  : 'bg-[#4a0d0d] text-orange-200 hover:bg-[#5c1313] border border-orange-500/30'
              }`}
            >
              {mission3Cleared ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">3</span>
              )}
              <span>MISSION 3 (순서 재구성)</span>
            </button>

            {currentScreen === 'complete' && (
              <>
                <span className="text-orange-400 text-xs">➔</span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold animate-pulse shadow-md border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> COMPLETE
                </span>
              </>
            )}
          </div>

          {/* Progress Bar with Indicator */}
          <div className="flex items-center gap-2 min-w-[160px] sm:min-w-[200px]">
            <span className="text-[11px] text-amber-200 font-bold whitespace-nowrap">진행률 {progressPercent}%</span>
            <div className="flex-1 h-3 bg-[#450a0a] rounded-full overflow-hidden border border-orange-500/50 p-0.5 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
