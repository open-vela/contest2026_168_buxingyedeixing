import { SHOT_TYPES, SHOT_LABELS } from './constants'

export default class MockProvider {
  constructor(callbacks) {
    this.callbacks = callbacks || {}
    this.timer = null
    this.elapsed = 0
    this.shotIndex = 0
  }

  start() {
    this.stop()
    this.timer = setInterval(() => {
      this.elapsed += 1
      if (this.callbacks.onHealth) {
        this.callbacks.onHealth({ heartRate: 105 + (this.elapsed % 36), stepsDelta: this.elapsed % 2 })
      }
      if (this.elapsed % 4 === 0 && this.callbacks.onShot) {
        const type = SHOT_TYPES[this.shotIndex % SHOT_TYPES.length]
        this.shotIndex += 1
        this.callbacks.onShot({ type, label: SHOT_LABELS[type], confidence: 68 + (this.shotIndex * 7) % 28 })
      }
    }, 1000)
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
  }
}
