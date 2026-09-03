import { ALGORITHM_VERSION, SHOT_TYPES } from './constants'
import dataStore from './data-store'
import MockProvider from './mock-provider'
import ImuManager from './imu-manager'
import HealthMonitor from './health-monitor'
import SwingDetector from './swing-detector'

function emptyHits() {
  return { total: 0, highClear: 0, smash: 0, drive: 0, lift: 0, drop: 0, unknown: 0 }
}

function freshRecord(settings) {
  const now = Date.now()
  return {
    schemaVersion: 1,
    id: `workout_${now}`,
    startTime: now,
    endTime: 0,
    duration: 0,
    activeDuration: 0,
    dataSource: settings.mockMode ? 'mock' : 'device',
    status: 'running',
    heartRate: { current: null, avg: null, max: null, sampleCount: 0, total: 0 },
    calories: { value: 0, method: 'estimated' },
    hits: emptyHits(),
    latestShot: null,
    movement: { steps: 0, distance: 0, avgSpeed: 0, maxSpeed: 0 },
    algorithm: { version: ALGORITHM_VERSION, sensitivity: settings.sensitivity }
  }
}

class WorkoutSession {
  constructor() {
    this.record = null
    this.settings = null
    this.listeners = []
    this.timer = null
    this.provider = null
    this.imu = null
    this.health = null
    this.detector = null
    this.sensorStatus = 'ready'
  }

  subscribe(listener) {
    if (this.listeners.indexOf(listener) < 0) this.listeners.push(listener)
    if (this.record) listener(this.snapshot())
  }

  unsubscribe(listener) {
    this.listeners = this.listeners.filter(item => item !== listener)
  }

  snapshot() {
    return JSON.parse(JSON.stringify({ record: this.record, sensorStatus: this.sensorStatus }))
  }

  notify() {
    const state = this.snapshot()
    this.listeners.forEach(listener => listener(state))
  }

  start(settings) {
    this.stopProviders()
    this.settings = settings
    this.record = freshRecord(settings)
    this.sensorStatus = settings.mockMode ? 'mock' : 'connecting'
    this.detector = new SwingDetector(settings.sensitivity, result => this.onShot(result))
    if (settings.mockMode) {
      this.provider = new MockProvider({
        onHealth: data => { this.onHeartRate(data.heartRate); this.onSteps(data.stepsDelta) },
        onShot: result => this.onShot(result)
      })
      this.provider.start()
    } else {
      this.imu = new ImuManager(sample => this.detector.push(sample), () => { this.sensorStatus = 'imu-error'; this.notify() })
      this.health = new HealthMonitor(value => this.onHeartRate(value), () => { this.sensorStatus = 'heart-rate-error'; this.notify() })
      this.imu.start()
      this.health.start()
      this.sensorStatus = 'device'
    }
    this.notify()
  }

  tick() {
    if (!this.record || this.record.status !== 'running') return
    this.record.duration += 1
    this.record.activeDuration += 1
    const weight = Number(this.settings.weight) || 65
    this.record.calories.value = Math.round(weight * 7 * this.record.activeDuration / 3600 * 10) / 10
    const hours = Math.max(this.record.activeDuration / 3600, 1 / 3600)
    this.record.movement.distance = Math.round(this.record.movement.steps * 0.0007 * 100) / 100
    this.record.movement.avgSpeed = Math.round(this.record.movement.distance / hours * 10) / 10
    this.record.movement.maxSpeed = Math.max(this.record.movement.maxSpeed, this.record.movement.avgSpeed)
    if (this.record.duration % 10 === 0) dataStore.saveActive(this.record)
    this.notify()
  }

  onHeartRate(value) {
    if (!this.record) return
    const heart = this.record.heartRate
    heart.current = value
    heart.sampleCount += 1
    heart.total += value
    heart.avg = Math.round(heart.total / heart.sampleCount)
    heart.max = Math.max(heart.max || 0, value)
    this.notify()
  }

  onSteps(delta) {
    if (this.record && this.record.status === 'running') this.record.movement.steps += delta
  }

  onShot(result) {
    if (!this.record || this.record.status !== 'running') return
    const type = SHOT_TYPES.indexOf(result.type) >= 0 ? result.type : 'unknown'
    this.record.hits[type] += 1
    this.record.hits.total += 1
    this.record.latestShot = { type, label: result.label || '未识别', confidence: result.confidence || 0, timestamp: Date.now() }
    this.notify()
  }

  togglePause() {
    if (!this.record) return
    this.record.status = this.record.status === 'paused' ? 'running' : 'paused'
    this.notify()
  }

  finish() {
    if (!this.record) return null
    this.record.status = 'finished'
    this.record.endTime = Date.now()
    this.stopProviders()
    dataStore.clearActive()
    this.notify()
    return JSON.parse(JSON.stringify(this.record))
  }

  stopProviders() {
    if (this.provider) this.provider.stop()
    if (this.imu) this.imu.stop()
    if (this.health) this.health.stop()
    this.provider = null
    this.imu = null
    this.health = null
  }

  discard() {
    this.stopProviders()
    this.record = null
    dataStore.clearActive()
  }
}

export default new WorkoutSession()
