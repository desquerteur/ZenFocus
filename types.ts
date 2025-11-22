
export enum ThemeType {
  SNOW = 'SNOW',
  FOREST = 'FOREST',
  WATER = 'WATER',
  MOUNTAINS = 'MOUNTAINS',
  CUSTOM = 'CUSTOM',
}

export interface ThemeConfig {
  type: ThemeType;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  imageUrl: string;
  audioPreset: AudioPreset;
}

export enum AudioPreset {
  WIND = 'WIND',
  FOREST_AMBIENCE = 'FOREST_AMBIENCE',
  OCEAN = 'OCEAN',
  DEEP_DRONE = 'DEEP_DRONE',
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface FocusPlanResponse {
  tasks: string[];
  motivationalQuote: string;
}

export type AnimationSpeed = 'zen' | 'slow' | 'normal';

export interface AppSettings {
  // Audio
  volume: number;
  timerAlarm: boolean;
  alarmSound: string; // URL of the selected ringtone
  
  // Timer
  showSeconds: boolean;
  
  // Visuals
  particlesEnabled: boolean;
  breathingEffectEnabled: boolean;
  focusBlurEnabled: boolean; // New setting to control blur on inactivity
  backgroundBlur: number; // px
  overlayOpacity: number; // 0-1
  animationSpeed: AnimationSpeed;
  customBackgroundImage: string | null;
  
  // Workflow
  hideCompletedTasks: boolean;
}
