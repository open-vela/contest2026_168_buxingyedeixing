function magnitude(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
}

function stats(values) {
  if (!values.length) return { max: 0, mean: 0, std: 0, energy: 0 }
  let max = 0
  let sum = 0
  let energy = 0
  values.forEach(value => {
    max = Math.max(max, value)
    sum += value
    energy += value * value
  })
  const mean = sum / values.length
  const variance = values.reduce((total, value) => total + Math.pow(value - mean, 2), 0) / values.length
  return { max, mean, std: Math.sqrt(variance), energy: energy / values.length }
}

export default {
  extract(samples) {
    if (!samples || samples.length < 2) return null
    const accel = samples.map(sample => sample.accelMagnitude || magnitude(sample.accel))
    const gyro = samples.map(sample => sample.gyroMagnitude || magnitude(sample.gyro))
    const accelStats = stats(accel)
    const gyroStats = stats(gyro)
    const first = samples[0]
    const last = samples[samples.length - 1]
    const duration = Math.max(1, last.timestamp - first.timestamp)
    const direction = {
      x: last.accel.x - first.accel.x,
      y: last.accel.y - first.accel.y,
      z: last.accel.z - first.accel.z
    }
    return {
      duration,
      accelPeak: accelStats.max,
      accelMean: accelStats.mean,
      accelStd: accelStats.std,
      gyroPeak: gyroStats.max,
      gyroMean: gyroStats.mean,
      gyroStd: gyroStats.std,
      energy: accelStats.energy + gyroStats.energy / 1000,
      verticalDelta: direction.y,
      horizontalDelta: Math.abs(direction.x) + Math.abs(direction.z)
    }
  }
}
