export const SHOT_TYPES = ['highClear', 'smash', 'drive', 'lift', 'drop']

export const SHOT_LABELS = {
  highClear: '高远球',
  smash: '杀球',
  drive: '平抽',
  lift: '挑球',
  drop: '吊球',
  unknown: '未识别'
}

export const DEFAULT_SETTINGS = {
  unit: 'metric',
  weight: 65,
  dominantHand: 'right',
  sensitivity: 'medium',
  reminder: true,
  heartRateWarningEnabled: true,
  heartRateWarning: 165,
  mockMode: true
}

export const STORAGE_KEYS = {
  settings: 'user_settings',
  activeWorkout: 'active_workout',
  history: 'workout_history',
  lastWorkout: 'last_workout'
}

export const ALGORITHM_VERSION = 'rule-v1'

export const DETECTOR_CONFIG = {
  low: { accelStart: 15, gyroStart: 160, accelEnd: 11, gyroEnd: 80 },
  medium: { accelStart: 19, gyroStart: 220, accelEnd: 12, gyroEnd: 100 },
  high: { accelStart: 24, gyroStart: 300, accelEnd: 14, gyroEnd: 130 },
  minDuration: 80,
  maxDuration: 400,
  cooldown: 220
}
