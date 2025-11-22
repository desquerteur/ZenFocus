
import { ThemeType, ThemeConfig, AudioPreset } from './types';

// Curated 4K Unsplash images for maximum aesthetic appeal
export const THEMES: Record<ThemeType, ThemeConfig> = {
  [ThemeType.SNOW]: {
    type: ThemeType.SNOW,
    label: 'Snow',
    primaryColor: 'from-slate-200 to-slate-400',
    secondaryColor: 'bg-slate-900/20',
    // Minimalist winter landscape with fog
    imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=3840&auto=format&fit=crop',
    audioPreset: AudioPreset.WIND,
  },
  [ThemeType.FOREST]: {
    type: ThemeType.FOREST,
    label: 'Forest',
    primaryColor: 'from-emerald-200 to-emerald-400',
    secondaryColor: 'bg-emerald-900/20',
    // Moody deep forest with mist
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=3840&auto=format&fit=crop',
    audioPreset: AudioPreset.FOREST_AMBIENCE,
  },
  [ThemeType.WATER]: {
    type: ThemeType.WATER,
    label: 'Water',
    primaryColor: 'from-cyan-200 to-blue-400',
    secondaryColor: 'bg-blue-900/20',
    // Dark moody ocean waves
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=3840&auto=format&fit=crop',
    audioPreset: AudioPreset.OCEAN,
  },
  [ThemeType.MOUNTAINS]: {
    type: ThemeType.MOUNTAINS,
    label: 'Mountains',
    primaryColor: 'from-indigo-200 to-purple-400',
    secondaryColor: 'bg-indigo-900/20',
    // Majestic blue mountains
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3840&auto=format&fit=crop',
    audioPreset: AudioPreset.DEEP_DRONE,
  },
  [ThemeType.CUSTOM]: {
    type: ThemeType.CUSTOM,
    label: 'Custom',
    primaryColor: 'from-gray-200 to-gray-400',
    secondaryColor: 'bg-gray-900/20',
    // Default abstract dark texture if no image uploaded
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3840&auto=format&fit=crop',
    audioPreset: AudioPreset.DEEP_DRONE, // Default sound
  },
};

export const DEFAULT_TIMER_MINUTES = 30;

export const ALARM_SOUNDS = [
  { label: 'Zen Temple Bell', url: 'https://assets.mixkit.co/active_storage/sfx/1126/1126-preview.mp3' },
  { label: 'Tibetan Bowl', url: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3' },
  { label: 'Gentle Chime', url: 'https://assets.mixkit.co/active_storage/sfx/219/219-preview.mp3' },
  { label: 'Soft Success', url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' },
  { label: 'Deep Gong', url: 'https://assets.mixkit.co/active_storage/sfx/2691/2691-preview.mp3' },
  { label: 'Acoustic Guitar', url: 'https://assets.mixkit.co/active_storage/sfx/161/161-preview.mp3' },
  { label: 'Dreamy Harp', url: 'https://assets.mixkit.co/active_storage/sfx/622/622-preview.mp3' },
  { label: 'Calm Piano', url: 'https://assets.mixkit.co/active_storage/sfx/1114/1114-preview.mp3' },
  { label: 'Wind Chimes', url: 'https://assets.mixkit.co/active_storage/sfx/2644/2644-preview.mp3' },
  { label: 'Magical', url: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' },
  { label: 'Positive Hum', url: 'https://assets.mixkit.co/active_storage/sfx/1118/1118-preview.mp3' },
];
