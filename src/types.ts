export type MissionId = 1 | 2 | 3;

export type GameScreen = 'start' | 'group_select' | 'mission1' | 'mission2' | 'mission3' | 'complete';

export type CookingCategory = '생조리' | '가열조리';

export interface CookingMethod {
  id: string;
  name: string;
  category: CookingCategory;
  heatMedium?: '물' | '수증기' | '기름' | '공기' | '해당없음(가열 안 함)';
  icon: string;
  tagline: string;
  description: string;
  effect: string; // 식품에 일어나는 변화
  maratangUsage: string; // 마라탕에서의 구체적 사용
  isCorrect: boolean; // 마라탕 핵심 3대 조리법 여부 (불리기, 볶기, 끓이기)
  colorClass: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  fullText: string;
  cookingMethod: string;
  category: CookingCategory;
  tip: string;
  ingredient: string;
}

export interface GroupProgress {
  groupName: string;
  score: number;
  mission1Cleared: boolean;
  mission2Cleared: boolean;
  mission3Cleared: boolean;
  currentMission: MissionId;
  mission2Answer?: {
    methodId: string;
    methodName: string;
    answer1: string;
    answer2: string;
    answer3: string;
  };
  lastUpdated: number;
}
