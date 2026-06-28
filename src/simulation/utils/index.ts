/**
 * Helper utility modules for parsing configuration, calculating scores,
 * and checking rule dependencies. Stubs to be expanded during gameplay implementation.
 */

export const MissionHelpers = {
  calculateScorePercentage: (earnedPoints: number, totalPoints: number): number => {
    if (totalPoints <= 0) return 0
    return Math.round((earnedPoints / totalPoints) * 100)
  },

  checkEligibility: (_prerequisites: string[], _completedMissions: string[]): boolean => {
    // TODO: Verify dependencies map.
    return true
  },
}

export const SceneHelpers = {
  calculateHotspotPosition: (x: number, y: number, w: number, h: number) => {
    // Returns style parameters mapped to responsive percentage layouts
    return {
      left: `${x}%`,
      top: `${y}%`,
      width: `${w}%`,
      height: `${h}%`,
    }
  },
}

export const EventHelpers = {
  parseEventParams: (_rawParams: string): Record<string, any> => {
    // TODO: Parse event triggers parameters safely
    return {}
  },
}

export const RewardHelpers = {
  xpMultiplier: (score: number, baseXP: number): number => {
    // Calculate final XP payout with score multiplier bonuses
    if (score >= 95) return Math.round(baseXP * 1.5)
    if (score >= 80) return Math.round(baseXP * 1.2)
    return baseXP
  },
}
