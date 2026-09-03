import sensor from '@system.sensor'

function magnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

export default class ImuManager {
  constructor(onSample, onError) {
    this.onSample = onSample
    this.onError = onError
    this.accel = null
    this.gyro = null
    this.running = false
  }

  emit() {
    if (!this.running || !this.accel || !this.gyro) return
    const sample = {
      timestamp: Date.now(),
      accel: this.accel,
      gyro: this.gyro,
      accelMagnitude: magnitude(this.accel),
      gyroMagnitude: magnitude(this.gyro)
    }
    if (this.onSample) this.onSample(sample)
  }

  start() {
    this.running = true
    try {
      sensor.subscribeAccelerometer({
        interval: 'game',
        callback: data => { this.accel = data; this.emit() },
        fail: (data, code) => { if (this.onError) this.onError('accelerometer', code) }
      })
      sensor.subscribeGyroscope({
        interval: 'game',
        callback: data => { this.gyro = data; this.emit() },
        fail: (data, code) => { if (this.onError) this.onError('gyroscope', code) }
      })
    } catch (error) {
      if (this.onError) this.onError('imu', -1)
    }
  }

  stop() {
    this.running = false
    try { sensor.unsubscribeAccelerometer() } catch (error) {}
    try { sensor.unsubscribeGyroscope() } catch (error) {}
  }
}
