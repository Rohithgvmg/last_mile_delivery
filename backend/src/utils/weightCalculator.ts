export function calculateVolumetricWeight(
  length: number,
  breadth: number,
  height: number
): number {
  return (length * breadth * height) / 5000;
}

export function calculateChargeableWeight(
  actualWeight: number,
  volumetricWeight: number
): number {
  return Math.max(actualWeight, volumetricWeight);
}

