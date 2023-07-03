export const isTouchScreen = (): boolean => {
  if (typeof window !== 'undefined') return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return false
}
