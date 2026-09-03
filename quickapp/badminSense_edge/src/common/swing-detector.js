import { DETECTOR_CONFIG } from './constants'
import featureExtractor from './feature-extractor'
import shotClassifier from './shot-classifier'

export default class SwingDetector {
  constructor(sensitivity, onSwing) {
    this.sensitivity = sensitivity || 'medium'
    this.onSwing = onSwing
    this.state = 'idle'
    this.window = []
    this.startedAt = 0
    this.cooldownUntil = 0
  }

  reset() {
    this.state = 'idle'
    this.window = []
    this.startedAt = 0
  }

  push(sample) {
    const config = DETECTOR_CONFIG[this.sensitivity] || DETECTOR_CONFIG.medium
    const now = sample.timestamp
    if (now < this.cooldownUntil) return
    const active = sample.accelMagnitude >= config.accelStart && sample.gyroMagnitude >= config.gyroStart
    if (this.state === 'idle' && active) {
      this.state = 'active'
      this.startedAt = now
      this.window = [sample]
      return
    }
    if (this.state !== 'active') return
    this.window.push(sample)
    const elapsed = now - this.startedAt
    if (elapsed > DETECTOR_CONFIG.maxDuration) {
      this.reset()
      return
    }
    const ended = elapsed >= DETECTOR_CONFIG.minDuration && sample.accelMagnitude < config.accelEnd && sample.gyroMagnitude < config.gyroEnd
    if (ended) {
      const features = featureExtractor.extract(this.window)
      const result = shotClassifier.classify(features)
      this.cooldownUntil = now + DETECTOR_CONFIG.cooldown
      this.reset()
      if (this.onSwing) this.onSwing(result, features)
    }
  }
}
