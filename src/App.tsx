import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { Mission1 } from './components/Mission1';
import { Mission2 } from './components/Mission2';
import { Mission3 } from './components/Mission3';
import { ResultScreen } from './components/ResultScreen';
import { RecipeModal } from './components/RecipeModal';
import { TeacherModeModal } from './components/TeacherModeModal';
import { LiveDashboardModal } from './components/LiveDashboardModal';
import { ClearCelebrationModal } from './components/ClearCelebrationModal';
import { GameScreen, MissionId, GroupProgress } from './types';
import { sfx } from './utils/audio';
import { 
  subscribeToAllGroups, 
  saveGroupProgressToCloud, 
  resetGroupInCloud, 
  resetAllGroupsInCloud 
} from './utils/firebase';

const STORAGE_KEY = 'maratang_raid_storage_v2';

// Speed Bonus Calculator function
function calculateSpeedBonus(missionId: MissionId, secondsTaken: number): { bonus: number; badge: string } {
  if (missionId === 1) {
    if (secondsTaken <= 45) return { bonus: 50, badge: '⚡ 골드 스피드 (+50pt)' };
    if (secondsTaken <= 90) return { bonus: 30, badge: '🥈 실버 스피드 (+30pt)' };
    if (secondsTaken <= 150) return { bonus: 15, badge: '🥉 브론즈 스피드 (+15pt)' };
    return { bonus: 0, badge: '기본 점수 (+0pt)' };
  } else if (missionId === 2) {
    if (secondsTaken <= 60) return { bonus: 50, badge: '⚡ 골드 스피드 (+50pt)' };
    if (secondsTaken <= 120) return { bonus: 30, badge: '🥈 실버 스피드 (+30pt)' };
    if (secondsTaken <= 180) return { bonus: 15, badge: '🥉 브론즈 스피드 (+15pt)' };
    return { bonus: 0, badge: '기본 점수 (+0pt)' };
  } else {
    if (secondsTaken <= 60) return { bonus: 50, badge: '⚡ 골드 스피드 (+50pt)' };
    if (secondsTaken <= 120) return { bonus: 30, badge: '🥈 실버 스피드 (+30pt)' };
    if (secondsTaken <= 180) return { bonus: 15, badge: '🥉 브론즈 스피드 (+15pt)' };
    return { bonus: 0, badge: '기본 점수 (+0pt)' };
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [activeMission, setActiveMission] = useState<MissionId>(1);
  const [groupName, setGroupName] = useState<string | null>(null);
  
  // Base Score and Speed Bonus
  const [baseScore, setBaseScore] = useState<number>(0);
  const [speedBonus, setSpeedBonus] = useState<number>(0);

  const [mission1Cleared, setMission1Cleared] = useState<boolean>(false);
  const [mission2Cleared, setMission2Cleared] = useState<boolean>(false);
  const [mission3Cleared, setMission3Cleared] = useState<boolean>(false);

  // Per-mission timing tracking
  const [missionStartTime, setMissionStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [mission1Time, setMission1Time] = useState<number>(0);
  const [mission2Time, setMission2Time] = useState<number>(0);
  const [mission3Time, setMission3Time] = useState<number>(0);

  // Mission 2 saved report
  const [mission2Answer, setMission2Answer] = useState<{
    methodId: string;
    methodName: string;
    answer1: string;
    answer2: string;
    answer3: string;
  } | undefined>(undefined);

  // Modals
  const [isRecipeOpen, setIsRecipeOpen] = useState<boolean>(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState<boolean>(false);
  const [isLiveDashboardOpen, setIsLiveDashboardOpen] = useState<boolean>(false);
  
  // Celebration Modal state
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    badgeText: string;
    pointsEarned: number;
    speedBonusEarned?: number;
    timeSeconds?: number;
    nextAction: () => void;
    nextButtonText: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    badgeText: '',
    pointsEarned: 100,
    speedBonusEarned: 0,
    timeSeconds: 0,
    nextAction: () => {},
    nextButtonText: '다음 미션으로 이동',
  });

  // All groups history storage (synchronized with Firebase Firestore in real-time)
  const [allGroupsData, setAllGroupsData] = useState<Record<string, GroupProgress>>({});

  // Stopwatch timer interval
  useEffect(() => {
    if (currentScreen !== 'mission1' && currentScreen !== 'mission2' && currentScreen !== 'mission3') {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, activeMission]);

  // Reset timer on mission change
  const startMissionTimer = () => {
    setMissionStartTime(Date.now());
    setElapsedSeconds(0);
  };

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
            setBaseScore(gData.score - (gData.speedBonus || 0) || 0);
            setSpeedBonus(gData.speedBonus || 0);
            setMission1Cleared(gData.mission1Cleared || false);
            setMission2Cleared(gData.mission2Cleared || false);
            setMission3Cleared(gData.mission3Cleared || false);
            setMission1Time(gData.mission1TimeSeconds || 0);
            setMission2Time(gData.mission2TimeSeconds || 0);
            setMission3Time(gData.mission3TimeSeconds || 0);
            setMission2Answer(gData.mission2Answer);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Firebase Real-time Multi-device listener
  useEffect(() => {
    const unsubscribe = subscribeToAllGroups((cloudGroups) => {
      if (cloudGroups && Object.keys(cloudGroups).length > 0) {
        setAllGroupsData((prev) => ({
          ...prev,
          ...cloudGroups,
        }));

        // If current group has been updated on another device, sync current group state
        if (groupName && cloudGroups[groupName]) {
          const remote = cloudGroups[groupName];
          if (remote.lastUpdated > (allGroupsData[groupName]?.lastUpdated || 0)) {
            setMission1Cleared(remote.mission1Cleared);
            setMission2Cleared(remote.mission2Cleared);
            setMission3Cleared(remote.mission3Cleared);
            setSpeedBonus(remote.speedBonus || 0);
            setBaseScore(remote.score - (remote.speedBonus || 0));
            if (remote.mission2Answer) {
              setMission2Answer(remote.mission2Answer);
            }
          }
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [groupName]);

  // Synchronize current group state to LocalStorage and Firebase Cloud
  const syncGroupData = (updatedFields?: Partial<GroupProgress>) => {
    if (!groupName) return;

    const totalScore = baseScore + speedBonus;
    const totalTimeSeconds = mission1Time + mission2Time + mission3Time;

    const updatedGroup: GroupProgress = {
      groupName,
      score: totalScore,
      speedBonus,
      totalScore,
      mission1Cleared,
      mission2Cleared,
      mission3Cleared,
      currentMission: activeMission,
      totalTimeSeconds,
      mission1TimeSeconds: mission1Time,
      mission2TimeSeconds: mission2Time,
      mission3TimeSeconds: mission3Time,
      mission2Answer,
      lastUpdated: Date.now(),
      ...updatedFields,
    };

    const newAllGroups = {
      ...allGroupsData,
      [groupName]: updatedGroup,
    };

    setAllGroupsData(newAllGroups);

    // Save locally
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentGroup: groupName,
          allGroupsData: newAllGroups,
        })
      );
    } catch {
      // ignore
    }

    // Save to Firebase Cloud Firestore for multi-device sync
    saveGroupProgressToCloud(updatedGroup);
  };

  // Start Raid from StartScreen
  const handleStartRaid = (selectedGroup: string) => {
    setGroupName(selectedGroup);
    startMissionTimer();
    
    // Check if group has existing data in cloud or local
    const existing = allGroupsData[selectedGroup];
    if (existing) {
      setBaseScore(existing.score - (existing.speedBonus || 0));
      setSpeedBonus(existing.speedBonus || 0);
      setMission1Cleared(existing.mission1Cleared);
      setMission2Cleared(existing.mission2Cleared);
      setMission3Cleared(existing.mission3Cleared);
      setMission1Time(existing.mission1TimeSeconds || 0);
      setMission2Time(existing.mission2TimeSeconds || 0);
      setMission3Time(existing.mission3TimeSeconds || 0);
      setMission2Answer(existing.mission2Answer);
      
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
      setBaseScore(0);
      setSpeedBonus(0);
      setMission1Cleared(false);
      setMission2Cleared(false);
      setMission3Cleared(false);
      setMission1Time(0);
      setMission2Time(0);
      setMission3Time(0);
      setMission2Answer(undefined);
      setCurrentScreen('mission1');
      setActiveMission(1);
    }
  };

  // Complete Mission 1
  const handleCompleteMission1 = () => {
    const timeTaken = Math.max(1, elapsedSeconds);
    const { bonus } = calculateSpeedBonus(1, timeTaken);
    setMission1Time(timeTaken);

    const newBase = mission1Cleared ? baseScore : baseScore + 100;
    const newSpeedBonus = mission1Cleared ? speedBonus : speedBonus + bonus;
    const newTotal = newBase + newSpeedBonus;

    setBaseScore(newBase);
    setSpeedBonus(newSpeedBonus);
    setMission1Cleared(true);

    syncGroupData({
      score: newTotal,
      speedBonus: newSpeedBonus,
      totalScore: newTotal,
      mission1Cleared: true,
      mission1TimeSeconds: timeTaken,
      currentMission: 2,
    });

    setCelebrationState({
      isOpen: true,
      title: 'MISSION 1 CLEAR!',
      subtitle: '마라탕의 3대 조리방법(불리기, 볶기, 끓이기)을 모두 성공적으로 찾아냈습니다!',
      badgeText: '미션 1 완수',
      pointsEarned: 100,
      speedBonusEarned: bonus,
      timeSeconds: timeTaken,
      nextButtonText: 'MISSION 2로 이동하기 →',
      nextAction: () => {
        setCelebrationState((prev) => ({ ...prev, isOpen: false }));
        setCurrentScreen('mission2');
        setActiveMission(2);
        startMissionTimer();
      },
    });
  };

  // Complete Mission 2
  const handleCompleteMission2 = (answerData: {
    methodId: string;
    methodName: string;
    answer1: string;
    answer2: string;
    answer3: string;
  }) => {
    const timeTaken = Math.max(1, elapsedSeconds);
    const { bonus } = calculateSpeedBonus(2, timeTaken);
    setMission2Time(timeTaken);
    setMission2Answer(answerData);

    const newBase = mission2Cleared ? baseScore : baseScore + 100;
    const newSpeedBonus = mission2Cleared ? speedBonus : speedBonus + bonus;
    const newTotal = newBase + newSpeedBonus;

    setBaseScore(newBase);
    setSpeedBonus(newSpeedBonus);
    setMission2Cleared(true);

    syncGroupData({
      score: newTotal,
      speedBonus: newSpeedBonus,
      totalScore: newTotal,
      mission2Cleared: true,
      mission2TimeSeconds: timeTaken,
      mission2Answer: answerData,
      currentMission: 3,
    });

    setCelebrationState({
      isOpen: true,
      title: 'MISSION 2 CLEAR!',
      subtitle: '생조리와 가열조리의 과학적 원리와 마라탕 속 식품 변화를 밝혀냈습니다!',
      badgeText: '미션 2 완수',
      pointsEarned: 100,
      speedBonusEarned: bonus,
      timeSeconds: timeTaken,
      nextButtonText: 'MISSION 3로 이동하기 →',
      nextAction: () => {
        setCelebrationState((prev) => ({ ...prev, isOpen: false }));
        setCurrentScreen('mission3');
        setActiveMission(3);
        startMissionTimer();
      },
    });
  };

  // Complete Mission 3 & Raid
  const handleCompleteMission3 = () => {
    const timeTaken = Math.max(1, elapsedSeconds);
    const { bonus } = calculateSpeedBonus(3, timeTaken);
    setMission3Time(timeTaken);

    const newBase = mission3Cleared ? baseScore : baseScore + 100;
    const newSpeedBonus = mission3Cleared ? speedBonus : speedBonus + bonus;
    const newTotal = newBase + newSpeedBonus;
    const totalTimeSeconds = mission1Time + mission2Time + timeTaken;

    setBaseScore(newBase);
    setSpeedBonus(newSpeedBonus);
    setMission3Cleared(true);

    syncGroupData({
      score: newTotal,
      speedBonus: newSpeedBonus,
      totalScore: newTotal,
      mission3Cleared: true,
      mission3TimeSeconds: timeTaken,
      totalTimeSeconds,
      currentMission: 3,
    });

    setCelebrationState({
      isOpen: true,
      title: '🔥 RAID CLEAR! 🔥',
      subtitle: '마라탕 8단계 표준 조리 과정을 완벽하게 재구성했습니다! 최종 수사 결과 보고서로 이동합니다.',
      badgeText: '최종 레이드 완수',
      pointsEarned: 100,
      speedBonusEarned: bonus,
      timeSeconds: timeTaken,
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
    startMissionTimer();
    if (m === 1) setCurrentScreen('mission1');
    if (m === 2) setCurrentScreen('mission2');
    if (m === 3) setCurrentScreen('mission3');
  };

  // Restart
  const handleRestart = () => {
    setCurrentScreen('start');
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
      setBaseScore(300);
      syncGroupData({
        score: 300 + speedBonus,
        mission1Cleared: true,
        mission2Cleared: true,
        mission3Cleared: true,
      });
    } else {
      setActiveMission(target);
      setCurrentScreen(`mission${target}` as GameScreen);
      startMissionTimer();
    }
  };

  // Reset single group
  const handleResetGroup = async (targetGroup: string) => {
    const updated = { ...allGroupsData };
    delete updated[targetGroup];
    setAllGroupsData(updated);

    if (groupName === targetGroup) {
      setBaseScore(0);
      setSpeedBonus(0);
      setMission1Cleared(false);
      setMission2Cleared(false);
      setMission3Cleared(false);
      setMission1Time(0);
      setMission2Time(0);
      setMission3Time(0);
      setMission2Answer(undefined);
      setCurrentScreen('start');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentGroup: groupName, allGroupsData: updated }));
    await resetGroupInCloud(targetGroup);
  };

  // Reset all groups in local and cloud
  const handleResetAll = async () => {
    const groupNames = Object.keys(allGroupsData);
    setAllGroupsData({});
    setGroupName(null);
    setBaseScore(0);
    setSpeedBonus(0);
    setMission1Cleared(false);
    setMission2Cleared(false);
    setMission3Cleared(false);
    setMission1Time(0);
    setMission2Time(0);
    setMission3Time(0);
    setMission2Answer(undefined);
    setCurrentScreen('start');
    localStorage.removeItem(STORAGE_KEY);
    await resetAllGroupsInCloud(groupNames);
  };

  const totalScore = baseScore + speedBonus;
  const potentialBonus = calculateSpeedBonus(activeMission, elapsedSeconds);
  const totalTimeSeconds = mission1Time + mission2Time + mission3Time;

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#431407] flex flex-col selection:bg-[#dc2626] selection:text-white">
      
      {/* Top HUD Header (persistent) */}
      <Header
        currentScreen={currentScreen}
        activeMission={activeMission}
        groupName={groupName}
        score={totalScore}
        speedBonus={speedBonus}
        elapsedSeconds={elapsedSeconds}
        potentialBonus={potentialBonus}
        mission1Cleared={mission1Cleared}
        mission2Cleared={mission2Cleared}
        mission3Cleared={mission3Cleared}
        onOpenRecipe={() => setIsRecipeOpen(true)}
        onOpenTeacherMode={() => setIsTeacherOpen(true)}
        onOpenLiveDashboard={() => setIsLiveDashboardOpen(true)}
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
                initialAnswers={mission2Answer}
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
                score={totalScore}
                speedBonus={speedBonus}
                totalTimeSeconds={totalTimeSeconds}
                onRestart={handleRestart}
                onOpenTeacherMode={() => setIsTeacherOpen(true)}
                onOpenLiveDashboard={() => setIsLiveDashboardOpen(true)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Recipe Clue Modal */}
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
        currentScore={totalScore}
        currentMission={activeMission}
        allGroupsData={allGroupsData}
        onJumpToMission={handleTeacherJump}
        onResetGroup={handleResetGroup}
        onResetAll={handleResetAll}
      />

      {/* Real-Time All Groups Dashboard Modal (Multi-device synced via Firebase) */}
      <LiveDashboardModal
        isOpen={isLiveDashboardOpen}
        onClose={() => setIsLiveDashboardOpen(false)}
        allGroupsData={allGroupsData}
        currentGroup={groupName}
      />

      {/* Animated Mission Clear Modal */}
      <ClearCelebrationModal
        isOpen={celebrationState.isOpen}
        title={celebrationState.title}
        subtitle={celebrationState.subtitle}
        badgeText={celebrationState.badgeText}
        pointsEarned={celebrationState.pointsEarned}
        speedBonusEarned={celebrationState.speedBonusEarned}
        timeSeconds={celebrationState.timeSeconds}
        nextButtonText={celebrationState.nextButtonText}
        onNext={celebrationState.nextAction}
      />

      {/* Classroom Helper Footer */}
      <footer className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-orange-200 text-[11px] sm:text-xs py-3 px-4 border-t-2 border-orange-500/50 text-center flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span>
            🏫 중학교 기술·가정 [식생활과 조리] 교육용 협동 웹앱 — <strong>「마라탕 조리법 레이드」</strong>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            클라우드 다중 기기 실시간 연동
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLiveDashboardOpen(true)}
            className="text-amber-300 hover:text-white font-bold underline cursor-pointer text-[11px]"
          >
            📊 전체 모둠 실시간 현황판
          </button>
          <span className="text-amber-300 font-medium">
            전자칠판 터치 조작 & 학생 모둠 노트북 최적화
          </span>
        </div>
      </footer>

    </div>
  );
}
