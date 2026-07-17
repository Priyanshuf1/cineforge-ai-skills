export const getQualityTier = () => {
  if (typeof navigator === 'undefined') return 'high';
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 4;
  if (mem <= 4 || cores <= 4) return 'low';
  return 'high';
};
