// Each index is the level number (1-based), value is min XP for that level
export const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  150,  // Level 3
  225,  // Level 4
  325,  // Level 5
  450,  // Level 6
  600,  // Level 7
  775,  // Level 8
  975,  // Level 9
  1200, // Level 10
  // ...continue pattern up
  //  to level 50
];
const thresholds: number[] = [];
for (let i = 0; i < 50; i++) {
  if (i === 0) thresholds.push(0);
  else if (i === 1) thresholds.push(100);
  else thresholds.push(Math.min(thresholds[i - 1] + 50 + i * 5, 15000));
}
export const LEVEL_THRESHOLDS_50 = thresholds;

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS_50.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS_50[i]) {
      return i + 1; // Level numbers are 1-based
    }
  }
  return 1;
}