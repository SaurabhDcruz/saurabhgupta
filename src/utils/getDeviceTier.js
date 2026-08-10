export default function getDeviceTier() {
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4

  if (cores >= 8 && memory >= 8) {
    return 'high'
  }

  if (cores >= 4 && memory >= 4) {
    return 'medium'
  }

  return 'low'
}
