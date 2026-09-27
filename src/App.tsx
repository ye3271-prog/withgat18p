import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { Mission1 } from './components/Mission1';
import { Mission2 } from './components/Mission2';
import { Mission3 } from './components/Mission3';
import { ResultScreen } from './components/ResultScreen';
import { RecipeModal } from './components/RecipeModal';
import { TeacherModeModal } from './components/TeacherModeModal';
import { ClearCelebrationModal } from './components/ClearCelebrationModal';
import { GameScreen, MissionId, GroupProgress } from './types';
import { sfx } from './utils/audio';

const STORAGE_KEY = 'maratang_raid_storage_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [activeMission, setActiveMission] = useState<MissionId>(1);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const [mission1Cleared, setMission1Cleared] = useState<boolean>(false);
  const [mission2Cleared, setMission2Cleared] = useState<boolean>(false);
  const [mission3Cleared, setMission3Cleared] = useState<boolean>(false);

  // Modals
  const [isRecipeOpen, setIsRecipeOpen] = useState<boolean>(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState<boolean>(false);
  
  // Celebration Modal state
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    badgeText: string;
    pointsEarned: number;
    nextAction: () => void;
    nextButtonText: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    badgeText: '',
    pointsEarned: 100,
    nextAction: () => {},
    nextButtonText: '다음 미션으로 이동',
  });

  // All groups history storage
  const [allGroupsData, setAllGroupsData] = useState<Record<string, GroupProgress>>({});

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.allGroupsData) {
          setAllGroupsData(parsed.allGroupsData);
        }
        if (parsed.currentGroup) {
          setGroupName(parsed.currentGroup);
          const gData = parsed.allGroupsData?.[parsed.currentGroup];
          if (gData) {
            setScore(gData.score || 0);
            setMission1Cleared(gData.mission1Cleared || false);
            setMission2Cleared(gData.mission2Cleared || false);
            setMission3Cleared(gData.mission3Cleared || false);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save current group state whenever it changes
  useEffect(() => {
    if (!groupName) return;
    try {
      const updatedGroups: Record<string, GroupProgress> = {
        ...allGroupsData,
        [groupName]: {
          groupName,
          score,
          mission1Cleared,
          mission2Cleared,
          mission3Cleared,
          currentMission: activeMission,
          lastUpdated: Date.now(),
        },
      };
      setAllGroupsData(updatedGroups);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentGroup: groupName,
          allGroupsData: updatedGroups,
        })
      );
    } catch {
      // ignore
    }
  }, [groupName, score, mission1Cleared, mission2Cleared, mission3Cleared, activeMission]);

  // Start Raid from StartScreen
  const handleStartRaid = (selectedGroup: string) => {
    setGroupName(selectedGroup);
    
    // Check if group has existing data
    const existing = allGroupsData[selectedGroup];
    if (existing) {
      setScore(existing.score);
      setMission1Cleared(existing.mission1Cleared);
      setMission2Cleared(existing.mission2Cleared);
      setMission3Cleared(existing.mission3Cleared);
      
      if (!existing.mission1Cleared) {
        setCurrentScreen('mission1');
        setActiveMission(1);
      } else if (!existing.mission2Cleared) {
        setCurrentScreen('mission2');
        setActiveMission(2);
      } else if (!existing.mission3Cleared) {
        setCurrentScreen('mission3');
        setActiveMission(3);
      } else {
        setCurrentScreen('complete');
      }
    } else {
      setScore(0);
      setMission1Cleared(false);
      setMission2Cleared(false);
      setMission3Cleared(false);
      setCurrentScreen('mission1');
      setActiveMission(1);
    }
  };

  // Complete Mission 1
  const handleCompleteMission1 = () => {
    const newScore = mission1Cleared ? score : score + 100;
    setScore(newScore);
    setMission1Cleared(true);

    setCelebrationState({
      isOpen: true,
      title: 'MISSION 1 CLEAR!',
      subtitle: '마라탕의 3대 조리방법(불리기, 볶기, 끓이기)을 모두 성공적으로 찾아냈습니다!',
      badgeText: '미션 1 완수',
      pointsEarned: 100,
      nextButtonText: 'MISSION 2로 이동하기 →',
      nextAction: () => {
        setCelebrationState((prev) => ({ ...prev, isOpen: false }));
        setCurrentScreen('mission2');
        setActiveMission(2);
      },
    });
  };

  // Complete Mission 2
  const handleCompleteMission2 = () => {
    const newScore = mission2Cleared ? score : score + 100;
    setScore(newScore);
    setMission2Cleared(true);

    setCelebrationState({
      isOpen: true,
      title: 'MISSION 2 CLEAR!',
      subtitle: '생조리와 가열조리의 과학적 원리와 마라탕 속 식품 변화를 밝혀냈습니다!',
      badgeText: '미션 2 완수',
      pointsEarned: 100,
      nextButtonText: 'MISSION 3로 이동하기 →',
      nextAction: () => {
        setCelebrationState((prev) => ({ ...prev, isOpen: false }));
        setCurrentScreen('mission3');
        setActiveMission(3);
      },
    });
  };

  // Complete Mission 3 & Raid
  const handleCompleteMission3 = () => {
    const newScore = mission3Cleared ? score : score + 100;
    setScore(newScore);
    setMission3Cleared(true);

    setCelebrationState({
      isOpen: true,
      title: '🔥 RAID CLEAR! 🔥',
      subtitle: '마라탕 8단계 표준 조리 과정을 완벽하게 재구성했습니다! 최종 수사 결과 보고서로 이동합니다.',
      badgeText: '최종 레이드 완수',
      pointsEarned: 100,
      nextButtonText: '최종 결과 보고서 확인 →',
      nextAction: () => {
        setCelebrationState((prev) => ({ ...prev, isOpen: false }));
        setCurrentScreen('complete');
      },
    });
  };

  // Switch Mission via Breadcrumbs
  const handleSelectMission = (m: MissionId) => {
    sfx.playClick();
    setActiveMission(m);
    if (m === 1) setCurrentScreen('mission1');
    if (m === 2) setCurrentScreen('mission2');
    if (m === 3) setCurrentScreen('mission3');
  };

  // Restart
  const handleRestart = () => {
    if (window.confirm("처음 모둠 선택 화면으로 돌아가시겠습니까?")) {
      setCurrentScreen('start');
    }
  };

  // Teacher Jump
  const handleTeacherJump = (target: MissionId | 'start' | 'complete') => {
    if (target === 'start') {
      setCurrentScreen('start');
    } else if (target === 'complete') {
      setCurrentScreen('complete');
      setMission1Cleared(true);
      setMission2Cleared(true);
      setMission3Cleared(true);
      setScore(300);
    } else {
      setActiveMission(target);
      setCurrentScreen(`mission${target}` as GameScreen);
    }
  };

  // Reset single group
  const handleResetGroup = (targetGroup: string) => {
    const updated = { ...allGroupsData };
    delete updated[targetGroup];
    setAllGroupsData(updated);

    if (groupName === targetGroup) {
      setScore(0);
      setMission1Cleared(false);
      setMission2Cleared(false);
      setMission3Cleared(false);
      setCurrentScreen('start');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentGroup: groupName, allGroupsData: updated }));
  };

  // Reset all
  const handleResetAll = () => {
    setAllGroupsData({});
    setGroupName(null);
    setScore(0);
    setMission1Cleared(false);
    setMission2Cleared(false);
    setMission3Cleared(false);
    setCurrentScreen('start');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#431407] flex flex-col selection:bg-[#dc2626] selection:text-white">
      
      {/* Top HUD Header (persistent) */}
      <Header
        currentScreen={currentScreen}
        activeMission={activeMission}
        groupName={groupName}
        score={score}
        mission1Cleared={mission1Cleared}
        mission2Cleared={mission2Cleared}
        mission3Cleared={mission3Cleared}
        onOpenRecipe={() => setIsRecipeOpen(true)}
        onOpenTeacherMode={() => setIsTeacherOpen(true)}
        onSelectMission={handleSelectMission}
      />

      {/* Main Game Screen Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {currentScreen === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <StartScreen onStartGame={handleStartRaid} savedGroup={groupName} />
            </motion.div>
          )}

          {currentScreen === 'mission1' && (
            <motion.div
              key="mission1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Mission1
                onComplete={handleCompleteMission1}
                onOpenRecipe={() => setIsRecipeOpen(true)}
                isAlreadyCleared={mission1Cleared}
              />
            </motion.div>
          )}

          {currentScreen === 'mission2' && (
            <motion.div
              key="mission2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Mission2
                onComplete={handleCompleteMission2}
                onOpenRecipe={() => setIsRecipeOpen(true)}
                isAlreadyCleared={mission2Cleared}
              />
            </motion.div>
          )}

          {currentScreen === 'mission3' && (
            <motion.div
              key="mission3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Mission3
                onComplete={handleCompleteMission3}
                onOpenRecipe={() => setIsRecipeOpen(true)}
                isAlreadyCleared={mission3Cleared}
              />
            </motion.div>
          )}

          {currentScreen === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultScreen
                groupName={groupName || '우리 모둠'}
                score={score}
                onRestart={handleRestart}
                onOpenTeacherMode={() => setIsTeacherOpen(true)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        isMission1Mode={!mission1Cleared}
      />

      {/* Teacher Mode Modal */}
      <TeacherModeModal
        isOpen={isTeacherOpen}
        onClose={() => setIsTeacherOpen(false)}
        currentGroup={groupName}
        currentScore={score}
        currentMission={activeMission}
        allGroupsData={allGroupsData}
        onJumpToMission={handleTeacherJump}
        onResetGroup={handleResetGroup}
        onResetAll={handleResetAll}
      />

      {/* Animated Mission Clear Modal */}
      <ClearCelebrationModal
        isOpen={celebrationState.isOpen}
        title={celebrationState.title}
        subtitle={celebrationState.subtitle}
        badgeText={celebrationState.badgeText}
        pointsEarned={celebrationState.pointsEarned}
        nextButtonText={celebrationState.nextButtonText}
        onNext={celebrationState.nextAction}
      />

      {/* Classroom Helper Footer */}
      <footer className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-orange-200 text-[11px] sm:text-xs py-3 px-4 border-t-2 border-orange-500/50 text-center flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
        <span>
          🏫 중학교 기술·가정 [식생활과 조리] 교육용 협동 웹앱 — <strong>「마라탕 조리법 레이드」</strong>
        </span>
        <span className="text-amber-300 font-medium">
          전자칠판 터치 조작 & 학생 모둠 노트북 최적화
        </span>
      </footer>

    </div>
  );
}
