import { SHOT_LABELS } from './constants'

function clamp(value) {
  return Math.max(0, Math.min(1, value))
}

export default {
  classify(features) {
    if (!features) return { type: 'unknown', label: SHOT_LABELS.unknown, confidence: 0 }
    const a = features.accelPeak
    const g = features.gyroPeak
    const vertical = features.verticalDelta
    const horizontal = features.horizontalDelta
    const scores = {
      smash: clamp((a - 22) / 24) * 0.45 + clamp((g - 300) / 700) * 0.4 + clamp(-vertical / 10) * 0.15,
      highClear: clamp((a - 16) / 20) * 0.25 + clamp((g - 220) / 600) * 0.35 + clamp(vertical / 10) * 0.4,
      drive: clamp((a - 15) / 18) * 0.25 + clamp((g - 200) / 500) * 0.3 + clamp(horizontal / 12) * 0.45,
      lift: clamp((a - 13) / 16) * 0.25 + clamp((g - 150) / 450) * 0.25 + clamp(vertical / 8) * 0.5,
      drop: clamp(1 - Math.abs(a - 14) / 14) * 0.4 + clamp(1 - Math.abs(g - 180) / 250) * 0.4 + clamp((350 - features.duration) / 270) * 0.2
    }
    const ranked = Object.keys(scores).sort((left, right) => scores[right] - scores[left])
    const best = ranked[0]
    const confidence = Math.round(clamp(scores[best] * 0.75 + (scores[best] - scores[ranked[1]]) * 0.5) * 100)
    if (confidence < 35) return { type: 'unknown', label: SHOT_LABELS.unknown, confidence }
    return { type: best, label: SHOT_LABELS[best], confidence }
  }
}
