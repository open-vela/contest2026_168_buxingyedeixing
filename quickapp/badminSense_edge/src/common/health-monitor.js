import sensor from '@system.sensor'

export default class HealthMonitor {
  constructor(onHeartRate, onError) {
    this.onHeartRate = onHeartRate
    this.onError = onError
  }

  start() {
    try {
      sensor.subscribe({
        type: 'heartRate',
        callback: data => {
          const value = Number(data.value)
          if (value >= 35 && value <= 230 && this.onHeartRate) this.onHeartRate(value)
        },
        fail: (data, code) => { if (this.onError) this.onError(code) }
      })
    } catch (error) {
      if (this.onError) this.onError(-1)
    }
  }

  stop() {
    try { sensor.unsubscribe({ type: 'heartRate' }) } catch (error) {}
  }
}
